require("dotenv").config();
const crypto = require("crypto");
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { Serper } = require("serper");
const fetch = require("node-fetch");

// ---------------- AI MODEL ----------------
const model = new ChatOpenAI({
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// ---------------- SERPER DEV ----------------
const serper = new Serper({
  apiKey: process.env.SERPER_API_KEY
});

// ---------------- STORE LIST ----------------
const stores = [
  "Amazon", "Walmart", "BestBuy", "Target", "eBay"
];

// ---------------- UTILITIES ----------------

// Is this URL alive and reachable within 3 seconds?
const isUrlReachable = async (url) => {
  try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);

          const res = await fetch(url, {
            method: "HEAD",
            redirect: "follow",
            signal: controller.signal,
          });

          clearTimeout(timeout);
          return res.ok && !res.url.includes("404");
      }
      catch 
      {
          return false;
      }
};


const validateUrlsFast = async (urls, limit = 10) => {
  const results = [];

  await Promise.all(
    urls.map(async (url) => {
      if (results.length >= limit) return;

      const ok = await isUrlReachable(url);
      if (ok) results.push(url);
    })
  );

  return results;
};


const extractJSON = (content) => {
  content = content.trim().replace(/```json\s*/i, "").replace(/```$/, "").trim();
  const match = content.match(/\[.*\]/s);
  return match ? match[0] : null;
};

// ---------------- MAIN FUNCTION ----------------
const getProductOffers = async (productName) => {

        // Searching all the stores in paraller, to save time 
        const searchPromises = stores.map(store => 
          {
              const storeQuery = `site:${store.toLowerCase().replace(/ /g,"")}.com "${productName}" buy -review -blog`;
              return serper.search(storeQuery, { num: 3 }); // top 3 results per store
          });
        const allResults = await Promise.all(searchPromises);

        /* allResults are structured like :  
                          [
                { organic: [ { link: "..." }, { link: "..." } ] }, // Amazon
                { organic: [ { link: "..." } ] },                  // Walmart
                { organic: [ { link: "..." } ] }                   // Target
              ]
        */

        const MAX_URLS = 15;      

        //  Flatten all URLs and slice them 
        const urls = allResults
                    .flatMap(res => res.organic.map(r => r.link))
                    .filter(Boolean)
                    .slice(0, MAX_URLS);

          /* urls are structured like : 
              [
                    "amazon-link1",
                    "amazon-link2",
                    "walmart-link1",
                    "target-link1"
                  ]  */

        if (!urls.length) return [];

        //  Validate URLs, return up to 10 links 
        const validUrls = await validateUrlsFast(urls, 10);

        if (!validUrls.length) return [];

        //  Ask AI to extract store name, price, confirm single product page
        const prompt_template = ChatPromptTemplate.fromMessages([
          ["system", "You are an online shopping expert. Respond only with valid JSON array."],
          ["human", `
      Given the following URLs for a product:

      ${validUrls.join("\n")}

      Extract up to 5 offers that are **single product pages**.
      Each offer must include:
      - storeName
      - productPageLink (must be one of the URLs above)
      - price

      Return ONLY a JSON array in this format:
      [
      {{ "storeName": "Amazon", "productPageLink": "https://www.amazon.com/dp/B09XYZ123", "price": "$19" }},
      {{ "storeName": "Walmart", "productPageLink": "https://www.walmart.com/ip/123456", "price": "$25" }}
      ]

      - Use only the URLs provided above
      - Prefer different stores when possible
      - Do not include duplicates, listings, blogs, or category pages.
      `]
        ]);

        const formatted_prompt = await prompt_template.formatMessages({ productName });
        const response = await model.invoke(formatted_prompt);

        // Parse JSON safely
        const jsonString = extractJSON(response.content);
        if (!jsonString) return [];

        let offers;
        try {
          offers = JSON.parse(jsonString);
        } catch {
          console.error("AI returned invalid JSON:", response.content);
          return [];
        }

        // Enforce store diversity: max 1 offer per store first, then fill remaining
        const finalOffers = [];
        const seenUrls = new Set();
        const storesUsed = new Set();

        // pick one per store
        for (const offer of offers) {
          if (finalOffers.length === 5) break;
          if (!offer.productPageLink || seenUrls.has(offer.productPageLink)) continue;
          if (storesUsed.has(offer.storeName)) continue;
            finalOffers.push({
                id: crypto.randomUUID(),
                ...offer
            });
        //  finalOffers.push(offer);
          seenUrls.add(offer.productPageLink);
          storesUsed.add(offer.storeName);
        }

        // fill remaining offers ignoring store
        for (const offer of offers) {
          if (finalOffers.length === 5) break;
          if (!offer.productPageLink || seenUrls.has(offer.productPageLink)) continue;
          //finalOffers.push(offer);
            finalOffers.push({
                id: crypto.randomUUID(),
                ...offer
            });
        //  finalOffers
          seenUrls.add(offer.productPageLink);
        }

        return finalOffers;
};

module.exports = { getProductOffers };
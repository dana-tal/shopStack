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
  "Amazon", "Walmart", "BestBuy", "Target", "eBay",
  "AliExpress", "Costco", "IKEA", "Wayfair", "Newegg",
  "Home Depot", "Lowe's", "Zara", "H&M", "Uniqlo"
];

// ---------------- UTILITIES ----------------
const isUrlReachable = async (url) => {
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", timeout: 5000 });
    return res.ok && !res.url.includes("404");
  } catch {
    return false;
  }
};

const validateUrlsParallel = async (urls) => {
  const promises = urls.map(async url => ({ url, reachable: await isUrlReachable(url) }));
  const results = await Promise.all(promises);
  return results.filter(r => r.reachable).map(r => r.url);
};

const extractJSON = (content) => {
  content = content.trim().replace(/```json\s*/i, "").replace(/```$/, "").trim();
  const match = content.match(/\[.*\]/s);
  return match ? match[0] : null;
};

// ---------------- MAIN FUNCTION ----------------
const getProductOffers = async (productName) => {

  // 1️⃣ Parallel multi-store search
  const searchPromises = stores.map(store => {
    const storeQuery = `site:${store.toLowerCase().replace(/ /g,"")}.com "${productName}" buy -review -blog`;
    return serper.search(storeQuery, { num: 5 }); // top 5 results per store
  });

  const allResults = await Promise.all(searchPromises);

  // 2️⃣ Flatten all URLs
  const urls = allResults
    .flatMap(res => res.organic.map(r => r.link))
    .filter(Boolean);

  if (!urls.length) return [];

  // 3️⃣ Validate URLs in parallel
  const validUrls = await validateUrlsParallel(urls);
  if (!validUrls.length) return [];

  // 4️⃣ Ask AI to extract store name, price, confirm single product page
  const prompt_template = ChatPromptTemplate.fromMessages([
    ["system", "You are an online shopping expert. Respond only with valid JSON array."],
    ["human", `
Given the following URLs for a product:

${validUrls.join("\n")}

Extract exactly 15 offers that are **single product pages**.
Each offer must include:
- storeName
- productPageLink (must be one of the URLs above)
- price

Return ONLY a JSON array in this format:
[
{{ "storeName": "Amazon", "productPageLink": "https://www.amazon.com/dp/B09XYZ123", "price": "$19" }},
{{ "storeName": "Walmart", "productPageLink": "https://www.walmart.com/ip/123456", "price": "$25" }}
]

Do not include duplicates, listings, blogs, or category pages.
`]
  ]);

  const formatted_prompt = await prompt_template.formatMessages({ productName });
  const response = await model.invoke(formatted_prompt);

  // 5️⃣ Parse JSON safely
  const jsonString = extractJSON(response.content);
  if (!jsonString) return [];

  let offers;
  try {
    offers = JSON.parse(jsonString);
  } catch {
    console.error("AI returned invalid JSON:", response.content);
    return [];
  }

  // 6️⃣ Enforce store diversity: max 1 offer per store first, then fill remaining
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
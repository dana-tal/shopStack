require("dotenv").config({quiet:true});

const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
 const { SystemMessage, HumanMessage } = require("@langchain/core/messages");

const recommendationsModel = new ChatOpenAI({  model: "gpt-4.1-mini",
  temperature: 0,
});


const bestOfferModel = new ChatOpenAI({  model: "gpt-4.1-nano",
  temperature: 0,
});



//const filterModel = new ChatOpenAI ({ model:"gpt-4.1-nano", temperature:0});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", `
You are an e-commerce recommendation assistant.

Your task is to recommend products based on a given product according to the current mode.

You can receive two types of requests:

MODE 1 - Initial recommendation:
- This mode is used when the missing recommendations parameter is empty.
- Generate exactly {rec_num} product recommendations according to the rules below.

MODE 2 - Replacement recommendation:
- This mode is used when some previous recommendations could not be found in the marketplace (missing Recommendations is not empty).
- Generate only replacement products for the items listed in missingRecommendations.
- Keep all products listed in successfulRecommendations unchanged.
- Do not recommend products that already exist in successfulRecommendations.
- The number of returned products must exactly match the number of items in missingRecommendations.
- If missingRecommendations contains one item, return exactly one product.

Step 1: Determine the recommendation strategy.

- If the product is informational, educational, digital, or media-related (for example: books, courses, movies, games):
  Recommend SIMILAR products that a customer might also consider.

  For similar product recommendations:
  - Do not recommend different editions, versions, formats, or re-releases of the original product.
  - Recommend different products that a customer who liked the original product would likely enjoy.

- Otherwise:
  Recommend COMPLEMENTARY products.

A complementary product is a product that customers commonly purchase together with the original product in the same shopping session because it extends, supports, enhances, protects, or improves the usage experience of the original product.

General rules:
- Recommend only real, commonly sold marketplace products.
- Prefer practical, mass-market products.
- Recommendations should represent realistic cross-sell opportunities for an online store.
- Do not recommend products that serve the same primary purpose as the original product.
- Avoid alternatives, variations, or substitutes of the original product.
- Do not recommend products that are only loosely related by topic, category, or theme unless customers commonly purchase them together.
- Prefer products that are used together with the original product or improve its usage, protection, maintenance, or overall experience.
- Avoid purely decorative or thematic products unless they have a clear and common connection to the original product.
- Recommendation names should be specific enough for marketplace search.
- Avoid ambiguous generic terms.

Output rules:
- Return ONLY a JSON array.
- In MODE 1, the array must contain exactly {rec_num} product names.
- In MODE 2, the array must contain exactly the number of products listed in missingRecommendations.
- No explanations.
- No numbering.
- No markdown.
- No extra text.
`],
  ["human", `
The current product is:
{product_name}

Missing recommendations:
{missingRecommendations}

Successful recommendations that must be kept:
{successfulRecommendations}
`]
]);

const chain = prompt.pipe(recommendationsModel).pipe(new StringOutputParser());


const productsYouMayLikeList = async (product_name,rec_num=3,missingRecommendations = [],successfulRecommendations = [])=>
{
   const result = await chain.invoke({ product_name, missingRecommendations, successfulRecommendations,rec_num});
    return JSON.parse(result);
}

const pickBestProducts = async (input)=>
  { 
    const bestProducts = await Promise.all(input.map( async (product_list)=>{          
         const bestProduct = await selectBestProduct(product_list);
         return bestProduct;   
    }));
   return bestProducts;
}

const selectBestProductMsg = new SystemMessage(`Return exactly one JSON object.

The object must contain only:
{
  "selectedOfferIndex": number
}

The selectedOfferIndex must be the index of the best marketplace offer from the input array.

Do not return the product name.
Do not return the link.
Do not add explanations.
Do not use markdown.`);


const selectBestProduct = async ( input_obj) =>{       

  const productName = Object.keys(input_obj)[0];
  const offers = input_obj[productName];

  if (!offers.length) return null;

  const response = await bestOfferModel.invoke([
    selectBestProductMsg,
    new HumanMessage(JSON.stringify(input_obj))
  ]);
 
  const result = JSON.parse(response.content);

  const index = Number(result.selectedOfferIndex);

  if (!Number.isInteger(index) || index < 0 || index >= offers.length) return null;

  return { name:productName, link: offers[index].link }
}



module.exports = {
  productsYouMayLikeList,
  pickBestProducts
};
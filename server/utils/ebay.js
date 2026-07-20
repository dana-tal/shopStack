const dotenv = require("dotenv");
const axios = require("axios");
const qs = require("qs");

dotenv.config({quiet:true});

const clientId = process.env.EBAY_CLIENT_ID;
const clientSecret = process.env.EBAY_CLIENT_SECRET;
const environment = process.env.EBAY_ENVIRONMENT || "production";
const marketplaceId = process.env.EBAY_MARKETPLACE_ID || "EBAY_US";



const tokenUrl =
  environment === "sandbox"
    ? "https://api.sandbox.ebay.com/identity/v1/oauth2/token"
    : "https://api.ebay.com/identity/v1/oauth2/token";

const searchUrl =
  environment === "sandbox"
    ? "https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search"
    : "https://api.ebay.com/buy/browse/v1/item_summary/search";


let tokenCache = null;
let tokenExpiresAt = 0;

async function getEbayAccessToken() {

  try {
    // Check if the token is cached and still valid
    if (tokenCache && Date.now() < tokenExpiresAt) {
      return tokenCache;
    }

    // Create a Base64-encoded string from clientId:clientSecret
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    // Request a new access token from eBay
    const response = await axios.post(
      tokenUrl,
      //qs.stringify({ grant_type: "client_credentials" }),
      qs.stringify({
            grant_type: "client_credentials",
        scope: "https://api.ebay.com/oauth/api_scope",
        }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    // Store the new access token and its expiration time
    tokenCache = response.data.access_token;
    tokenExpiresAt = Date.now() + (response.data.expires_in - 60) * 1000;

    return tokenCache;
  } catch (error) {
    
    console.log("failed getting ebay access token");
     console.error(error.response?.status);
    console.error(error.response?.data);
    throw error;
  }
}


async function getEbayProductLinks(productName, limit = 2) {
  try {
    // Get a valid access token before making the search request

    const token = await getEbayAccessToken();

    // Search for products using the eBay Browse API and prefer listings
    // that are more likely to be direct purchase pages.
    const response = await axios.get(searchUrl, {
      params: {
        q: productName,
        limit: Math.max(1, limit),
        filter: "buyingOptions:{FIXED_PRICE}", // choose products for buy now (fixed price) listings
        sort: "best_match", // rank results by best match to the query
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-EBAY-C-MARKETPLACE-ID": marketplaceId,
      },
    });

    // Normalize the response into a simple list of products with listing links
    const items = response.data.itemSummaries || [];


   const final_items = await Promise.all( items.map ( async (item)=>{
          
          return {
              title: item.title,
              condition: item.condition,
              price: item.price,
              seller: item.seller,
              link: item.itemWebUrl
            };
   } ));

   return { [productName] : final_items};

 
  } catch (error) {
    // Log the error and re-throw it so the caller can handle it
   console.error(error.response?.status);
console.error(error.response?.data);
    throw error;
  }
}


const getLinksForProducts = async (products) =>{

    const results = await Promise.all(products.map(product => { return  getEbayProductLinks(product) }));
    return results;
}

module.exports = {
  getLinksForProducts
};

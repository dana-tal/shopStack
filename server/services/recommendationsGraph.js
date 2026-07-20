const { StateGraph, END } = require("@langchain/langgraph");
const { productsYouMayLikeList , pickBestProducts} = require("./llmFunctions");
const { getLinksForProducts } = require("../utils/ebay");
require("dotenv").config({ quiet: true });

//console.time("buildGraph");

const recommendationsCount = Number(process.env.RECOMMENDATIONS_COUNT) || 3;

const retryCountDefault = Number.isInteger(Number(process.env.RETRY_COUNT)) ? Number(process.env.RETRY_COUNT) : 0;

const graph = new StateGraph({
  channels: {
    productName: {
     value :(oldValue, newValue) => newValue,  // for update , take the newer value
      default: () => ""   // the initial value for productName is an empty string
    },

    // recommendations for current iteration only 
    recommendations: {
      value: (oldValue, newValue) => newValue, // for update , take the newer value     
      default: () => []  // the initial value is an empty array
    },


   // cumulative eBay offers from all iterations: ovveride old values with new ones , but keep values that were not overriden
   ebayOffers: {
          value: (oldValue, newValue) => 
           {
                  const merged = [...oldValue];
                  newValue.forEach(newOffer => 
                    {
                      const productName = Object.keys(newOffer)[0];
                      const index = merged.findIndex(offer => Object.keys(offer)[0] === productName);

                      if (index >= 0) { merged[index] = newOffer;} 
                      else { merged.push(newOffer);}
                    });
                    return merged;
          },
          default: () => []
    },

    // final results 
    bestProducts: {
        value: (oldValue, newValue) => newValue,
        default: () => []
    },
    successfulRecommendations: 
    {
       value: (oldValue, newValue) => [...new Set([...oldValue, ...newValue])],
      default: () => []
    },

    // missing recommendations for current iteration only 
    missingRecommendations: {
      value: (oldValue, newValue) => newValue,
      default: () => []
    },

    retryCount: {
      value: (oldValue, newValue) => newValue,
      default: () => retryCountDefault
    }
  }
});


graph.addNode("generateRecommendations", async (state) => 
{
  //console.time("generateRecommendations");
  let recommendations;
  let retryCount = state.retryCount;
  
  if (state.missingRecommendations?.length > 0 && state.retryCount > 0) 
  {
    recommendations = await productsYouMayLikeList( state.productName,recommendationsCount,state.missingRecommendations,state.successfulRecommendations);
    retryCount-=1;
  } 
  else 
  {
    recommendations = await productsYouMayLikeList(state.productName,recommendationsCount);
  }

//  console.log("recommendations:", recommendations);
 // console.timeEnd("generateRecommendations");

  return { recommendations, retryCount };
});

graph.addNode("searchEbay", async (state) => {
   //  console.time("searchEbay");
  const ebayOffers = await getLinksForProducts(state.recommendations);
   //console.log("ebay offers:");
  // console.log(ebayOffers);
   //console.timeEnd("searchEbay");
  return { ebayOffers };
});

graph.addNode("checkEbayResults", async (state) => {

  const successfulRecommendations = [];
  const missingRecommendations = [];

  state.recommendations.forEach(productName => {
    const productOffers = state.ebayOffers.find(
      item => item[productName]
    );

    if (productOffers && productOffers[productName].length > 0) {
      successfulRecommendations.push(productName);
    } else {
      missingRecommendations.push(productName);
    }
  });

 // console.log("checkEbayResults:")
/*  console.log({
  successfulRecommendations,
  missingRecommendations
}); */

  return {
    successfulRecommendations,
    missingRecommendations
  };
});


graph.addNode("testMissing", async (state) => {
  if (state.retryCount === 0) return { ebayOffers: [{ [state.recommendations[1]]: [] }] };
  return {};
});



graph.addNode("pickBestOffers", async (state) => {
  //console.time("pickBestOffers");
  // filter missing products from ebayOffers
   const ebayOffers = state.ebayOffers.filter(item => Object.values(item)[0].length > 0);
  const bestProducts = (await pickBestProducts(ebayOffers)).filter(Boolean);
  //console.timeEnd("pickBestOffers");
  return { bestProducts };
});


const routeAfterCheck = (state) => {
  if (state.missingRecommendations.length > 0 && state.retryCount > 0) {
    return "generateRecommendations";
  }

  return "pickBestOffers";
};

graph.setEntryPoint("generateRecommendations");  // we start from node test 
graph.addEdge("generateRecommendations", "searchEbay");
graph.addEdge("searchEbay", "checkEbayResults");
 // graph.addEdge("searchEbay", "testMissing");
 // graph.addEdge("testMissing", "checkEbayResults");
graph.addConditionalEdges("checkEbayResults",routeAfterCheck);
graph.addEdge("pickBestOffers", END);

const app = graph.compile();
//console.timeEnd("buildGraph");


module.exports = {
  app
};
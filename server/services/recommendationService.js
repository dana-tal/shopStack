const { app } = require("./recommendationsGraph");

const getRecommendations = async (productName) => {
  const result = await app.invoke({
    productName
  });

  return result.bestProducts;
};

module.exports = {
  getRecommendations
};
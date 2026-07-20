const { app } = require("./services/recommendationsGraph");

async function test() {
  const result = await app.invoke({
    productName: "Astrolabe"
  });

  console.log(result.bestProducts);
}

test();
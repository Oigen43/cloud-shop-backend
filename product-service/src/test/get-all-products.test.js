const axios = require('axios');

const productList = require('../db.json');
const { url } = require('../configuration');

describe("get all products", () => {
  test("it should return all products", async () => {
    const {data: products} = await axios.get(url);

    expect(products).toEqual(productList);
  });
});

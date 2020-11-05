const axios = require('axios');

const productList = require('../db.json');
const { url } = require('../configuration');

describe("get product by id", () => {
  test("it should return product by id", async () => {
    const { id } = productList[0];
    const expectedProduct = productList[0];

    const { data: product } = await axios.get(`${url}/${id}`);

    expect(product).toEqual(expectedProduct);
  });

  test("it should return error Product not found with 404 error status", async () => {
    let errorStatus, errorDescription;

    try {
      await axios.get(`${url}/${'hello'}`);
    } catch (error) {
      errorStatus = error.response.status;
      errorDescription = error.response.data.description;
    }

    expect(errorStatus).toEqual(404);
    expect(errorDescription).toEqual('Product not found');
  });
});

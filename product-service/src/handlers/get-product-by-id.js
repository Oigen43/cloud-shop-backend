const axios = require('axios');

const productList = require('../db.json');

export const getProductById = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product = productList.find(item => item.id === productId);

    // just a random request for making the task with async/await
    await axios.get('https://jsonplaceholder.typicode.com/todos/1');

    if (!product) throw new Error();

    return {
      statusCode: 200,
      body: JSON.stringify(product),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  } catch (error) {
    console.log('ERROR', error);
    return {
      statusCode: 404,
      body: JSON.stringify({ description: "Product not found" }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }
  }
};

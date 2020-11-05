const productList = require('../db.json');

export const getAllProducts = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(productList),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};

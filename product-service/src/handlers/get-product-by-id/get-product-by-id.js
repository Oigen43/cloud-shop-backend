import { createClient } from '../../db/connection';
import { response } from "../../utils";

import query from './get-product-by-id.sql';

export const getProductById = async (event) => {
  const client = await createClient();
  try {
    console.log('get-product-by-id-event', JSON.stringify(event));
    console.log('path parameters', JSON.stringify(event.pathParameters));
    const { productId } = event.pathParameters;

    const res = await client.query(query, [productId]);
    const product = res.rows[0];

    if (!product) {
      return response(404, { description: "product-not-found" });
    }

    return response(200, product);
  } catch (error) {
    console.log('get-product-by-id-error', JSON.stringify(error));
    return response(500, { description: `get-product-by-id-error ${JSON.stringify(error)}` })
  } finally {
    client.end();
  }
};

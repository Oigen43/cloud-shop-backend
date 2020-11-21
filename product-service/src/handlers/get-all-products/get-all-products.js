import { createClient } from '../../db/connection';
import { response } from '../../utils';

import query from './get-all-products.sql';

export const getAllProducts = async (event) => {
  const client = await createClient();
  try {
    console.log('get-all-products-event', JSON.stringify(event));

    const res = await client.query(query);
    const productList = res.rows;

    client.end();
    return response(200, productList);
  } catch (error) {
    console.log('get-all-products-error', JSON.stringify(error));
    return response(500, { description: `get-all-products-error ${JSON.stringify(error)}` })
  } finally {
    client.end();
  }
};

import { createClient } from '../../db/connection';
import { response } from "../../utils";
import { validationPassed } from "./validator";

import query from './create-product.sql';

export const createProduct = async (event) => {
  const client = await createClient();
  try {
    console.log('create-product', JSON.stringify(event));
    console.log('body', JSON.stringify(event.body));
    const reqBody = JSON.parse(event.body);
    if (!validationPassed(reqBody)) return response(400, 'product-data-is-invalid');

    await client.query('BEGIN');
    const res = await client.query(query, [reqBody.description, reqBody.title, reqBody.price, reqBody.count]);
    const product = res.rows[0];
    await client.query('COMMIT');

    console.log('PRODUCT', JSON.stringify(product));

    client.end();
    return response(200, product);
  } catch (error) {
    console.log('create-product-error', JSON.stringify(error));
    await client.query('ROLLBACK');
    return response(500, { description: `create-product-error ${JSON.stringify(error)}` })
  } finally {
    client.end();
  }
};

import AWS from 'aws-sdk'
import {createClient} from "../../db/connection";
import {validationPassed} from "../create-product/validator";
import query from "../create-product/create-product.sql";

export const catalogBatchProcess = async (event) => {

  console.log('catalog-batch-process-event:', event);

  const sns = new AWS.SNS();
  const products = event.Records.map(i=>JSON.parse(i.body));
  console.log(products);
  const promises = [];
  for (const product of products) {
    const promise = new Promise(async (resolve, reject) => {
        const client = await createClient();
        try {
          console.log(products);
          console.log('create-product', console.log(product));
          if (!validationPassed(product)) throw new Error();
          console.log('passed');

          await client.query('BEGIN');
          const res = await client.query(query, [product.description, product.title, product.price, product.count]);
          const createResponse = res.rows[0];
          await client.query('COMMIT');

          console.log('catalog-batch-process-success');
          console.log('product-created: ', createResponse);
          resolve();
        } catch (error) {
          console.log('catalog-batch-process-error', error);
          reject();
          await client.query('ROLLBACK');
        } finally {
          client.end();
        }
    })
    promises.push(promise)
  }
  const results = await Promise.allSettled(promises)
  const isImportFailed = results.some(i=>i.status === 'rejected')
  console.log('import-failed: ', isImportFailed)
  const messageArray = results.map((result, i) => ({
    ...result,
    ...products[i]
  }))
  const message = `products-import:\r\n${messageArray.map(JSON.stringify).join('\r\n')}`
  await new Promise((resolve, reject) => {
    sns.publish({
      Subject: isImportFailed ? 'Some products are not imported' : 'All products imported',
      TopicArn: process.env.SNS_ARN,
      MessageAttributes: {
        isImportFailed: {
          DataType: 'String',
          StringValue: `${isImportFailed}`
        }
      },
      Message: message
    }, (err, res) => {
      if (err) {
        console.log('sns-sending-error: ', err)
        reject(err)
      } else {
        console.log('sns-sending-success ', messageArray)
        resolve(res)
      }
    })
  })
}

export default catalogBatchProcess
import AWS from 'aws-sdk';

import { response } from '../../utils';

export const importProductsFile = async (event) => {
  console.log('import-event', event);
  try {
    const { name } = event.queryStringParameters;
    const path = `uploaded/${name}`;

    console.log(path);

    const s3 = new AWS.S3({ region: 'us-east-1' });

    const params = {
      Bucket: 'import-products',
      Key: path,
      Expires: 60,
      ContentType: 'text/csv',
    };

    const url = await s3.getSignedUrlPromise('putObject', params);

    console.log(url);

    return response(200, url);
  } catch (error) {
    console.log('import-product-files-error', error);
    return response(500, { description: `import-product-files-error ${JSON.stringify(error)}` })
  }
};

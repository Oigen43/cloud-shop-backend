import AWSMock from 'aws-sdk-mock';

import { importProductsFile } from './import-products-file';

describe('check url signing', () => {

  test('should return signed url', async () => {
    const mockedUrl = 'https://hello.com';
    await AWSMock.mock('S3', 'getSignedUrl', (_, __, cb) => {
      cb(null, mockedUrl);
    });
    const signedUrl = await importProductsFile({
      queryStringParameters: { name: 'my.csv' }
    });

    expect(signedUrl.body).toBeDefined();
    expect(JSON.parse(signedUrl.body)).toEqual(mockedUrl);
  });
})

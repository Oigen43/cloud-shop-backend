import { Client } from 'pg';

import { catalogBatchProcess } from './catalog-batch-process';

jest.mock('pg', () => ({ Client: jest.fn(() => ({
    connect: jest.fn(),
    query: jest.fn().mockImplementation(() => {
      return Promise.resolve({ rows: [{ id: 'sss', title: 'title' }] })
    }),
    end: jest.fn()
  }))
}));

jest.mock('aws-sdk', () => ({
  SNS: jest.fn(() => ({
    publish: () => ({
      promise: jest.fn()
    })
  }))
}));

describe('should butch catalog processes', () => {
  let client;
  beforeEach(() => {
    client = new Client()
  });

  test('should log error due to passed invalid product', async () => {
    const logErrorSpy = jest.spyOn(console, 'error');
    const body = JSON.stringify({ description: 'description' });

    await catalogBatchProcess({ Records: [{ body }] });
    expect(logErrorSpy).toHaveBeenCalledWith('catalog-batch-process-error');
  })

  test('should create a new product', async () => {
    const logSpy = jest.spyOn(console, 'log');
    const body = JSON.stringify({ title: '1', description: '2', count: 3, price: 5 });

    await catalogBatchProcess({ Records: [{ body }] });
    expect(logSpy).toHaveBeenCalledWith('catalog-batch-process-success');
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
const express = require('express');
const axios = require('axios');
const dotenv= require('dotenv');
const NodeCache= require('node-cache');

const responseCache = new NodeCache();

dotenv.config();

const cacheMiddleware = (req, res, next) => {
  if (req.originalUrl.startsWith('/products') && req.method === 'GET') {
    const cache = responseCache.get(req.originalUrl);

    if (cache) {
      res.set(cache.headers).status(cache.status).send(cache.data);
      return;
    }
  }

  next();
};

const cacheResponseMiddleware = (req, res, next) => {
  if (res.internalResponse &&  req.originalUrl.startsWith('/products') && req.method === 'GET') {
    const { status, headers, data } = res.internalResponse;
    responseCache.set(req.originalUrl, { status, headers, data }, 120);
  }

  next();
};

const port = process.env.PORT || '3000';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cacheMiddleware);

app.all('/:name*', (req, res, next) => {
  try {
    const name = req.params.name;
    const serviceUrl = process.env[name];

    if (!serviceUrl) {
      throw new Error('Cannot process request');
    }

    const redirectUrl = serviceUrl + req.originalUrl.replace(`\/${name}`, '');

    console.log('URL', redirectUrl);

    axios({
      method: req.method,
      url: redirectUrl,
      data: ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method) ? req.body : null,
      headers: { ...req.headers, host: '' },
    })
      .then((response) => {
        res.internalResponse = response;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

app.use(cacheResponseMiddleware);

app.use((req, res, next) => {
  if (res.internalResponse) {
    const response = res.internalResponse;
    console.log('RESPONCE', response);
    res.set(response.headers).status(response.status).send(response.data);
    return;
  }
  next(new Error('Unknown path'));
});

app.use((err, req, res) => {
  if (err.response) {
    res.set(err.response.headers).status(err.response.status).send(err.response.data);
  } else {
    res.status(502).json({ message: 'Cannot process request' });
  }
});

app.listen(port, () =>
  console.log('Application started and listerning port ', port)
);

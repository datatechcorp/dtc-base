const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const fullNodeHost = 'http://localhost:16667';
const solidityNodeHost = 'http://localhost:16668';
const eventServerHost = 'http://localhost:16670';

const router = express.Router();

router.use(
  'node',
  createProxyMiddleware({
    target: fullNodeHost,
    changeOrigin: true,
    pathRewrite: {
      [`^/node`]: '',
    },
  })
);
router.use(
  'solidity',
  createProxyMiddleware({
    target: solidityNodeHost,
    changeOrigin: true,
    pathRewrite: {
      [`^/solidity`]: '',
    },
  })
);
router.use(
  'event',
  createProxyMiddleware({
    target: eventServerHost,
    changeOrigin: true,
    pathRewrite: {
      [`^/event`]: '',
    },
  })
);

module.exports = router;

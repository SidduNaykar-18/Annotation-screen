// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',  // Specify the endpoint you want to proxy to your backend
    createProxyMiddleware({
      target: 'http://192.168.10.182:6000',  // Replace with your backend URL
      changeOrigin: true,
    })
  );
};

const express = require('express');
const ProductController = require('./controllers/ProductController');

const routes = express.Router();

routes.get('/products', ProductController.index);
routes.post('/products', ProductController.store);

module.exports = routes;
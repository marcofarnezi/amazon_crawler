const express = require('express');
const ProductController = require('./controllers/ProductController');

const routes = express.Router();

routes.get('/products', ProductController.index);
routes.post('/products', DevContProductControllerroller.store);

module.exports = routes;
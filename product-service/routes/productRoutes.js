const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getProductById } = require('../controller/productController');

router.post('/', addProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;
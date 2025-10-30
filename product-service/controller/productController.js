const Product = require('../model/Product');
const redis = require('../utils/redisClient');

const addProduct = async (req, res) => {
    try {
        const { name, description, price, brand, stock, category, imageUrl } = req.body;

        const newProduct = new Product({
            name,
            description,
            price,
            brand,
            stock,
            category,
            imageUrl
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const cacheKey = `product:${productId}`;

        // Try cache first
        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                return res.status(200).json(parsed);
            }
        } catch (cacheErr) {
            // If cache fails, log and continue to DB lookup
            // redis client already logs warnings; keep flow resilient
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Cache the product for future requests (TTL: 300s)
        try {
            await redis.set(cacheKey, product, 300);
        } catch (cacheErr) {
            // ignore cache set failures
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

module.exports = {
    addProduct,
    getAllProducts,
    getProductById
};
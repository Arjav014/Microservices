const mongoose = require('mongoose');
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB_NAME } = require('../utils/config');

const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo-product-db:27017/${MONGO_DB_NAME}?authSource=admin`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully (Product Service)');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
};

module.exports = connectDB;

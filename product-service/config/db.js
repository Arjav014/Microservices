const mongoose = require('mongoose');
const logger = require('../utils/logger');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('MongoDB connected successfully (Product Service)');
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
  }
};

module.exports = connectDB;

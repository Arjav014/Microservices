module.exports = {
  MONGO_USERNAME: process.env.MONGO_USERNAME || 'admin',
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'admin',
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'productdb',
  PORT: process.env.PORT || 5678
};

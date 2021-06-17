const mongoose = require('mongoose');
const logger = require('../config/logger');

const cleanCollections = async () => {
  const { db } = mongoose.connection;
  const collections = await db.listCollections().toArray();
  collections
    .map((collection) => collection.name)
    .forEach(async (collectionName) => {
      db.dropCollection(collectionName);
    });
};

const migrateToVersion1 = async () => {
  logger.info('Migrating server to version 1');
  logger.info('Cleaning all collections');
  await cleanCollections();
};

module.exports = {
  migrateToVersion1,
};

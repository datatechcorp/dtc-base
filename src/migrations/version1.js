const logger = require('../config/logger');

const migrateToVersion1 = async () => {
  logger.info('Migrating server to version 1');
};

module.exports = {
  migrateToVersion1,
};

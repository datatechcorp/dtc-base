const logger = require('../config/logger');
const { userService } = require('../services');
const config = require('../config/config');

const addAdministrator = async () => {
  const { name, password, email } = config.admin;
  await userService.createUser({ name, password, email, role: 'admin', isEmailVerified: true });
};

const migrateToVersion2 = async () => {
  logger.info('Migrating server to version 2');
  logger.info('Adding administrator');
  await addAdministrator();
};

module.exports = {
  migrateToVersion2,
};

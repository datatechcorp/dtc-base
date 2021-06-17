const logger = require('../config/logger');
const { smService, userService } = require('../services');
const config = require('../config/config');

const addSocialMedia = async () => {
  const platforms = [
    'twitter',
    'facebook',
    'telegram',
    'weibo',
    'reddit',
    'medium',
    'steem',
    'instagram',
    'wechat',
    'group',
    'discord',
  ];
  await Promise.all(platforms.map((platform) => smService.savePlatform({ platform })));
};

const addAdministrator = async () => {
  const { name, password, email } = config.admin;
  await userService.createUser({ name, password, email, role: 'admin', isEmailVerified: true });
};

const migrateToVersion2 = async () => {
  logger.info('Migrating server to version 2');
  logger.info('Adding social media platforms');
  await addSocialMedia();
  logger.info('Adding administrator');
  await addAdministrator();
};

module.exports = {
  migrateToVersion2,
};

const setting = require('../config/setting');
const logger = require('../config/logger');
const { getSettingByKey, createSetting, updateSettingPair } = require('../services/setting.service');
const { migrateToVersion1 } = require('./version1');
const { migrateToVersion2 } = require('./version2');

const migrate = async () => {
  let version = 0;
  const result = await getSettingByKey('version');
  if (result) {
    version = result.value;
  }
  if (version !== setting.version) {
    if (setting.version === 1) {
      await migrateToVersion1();
      await createSetting('version', setting.version);
    }
    if (version < 2) {
      await migrateToVersion2();
    }
    if (setting.version !== 1) {
      await updateSettingPair('version', setting.version);
    }
  }
  logger.info('Server is up-to-date');
};

module.exports = {
  migrate,
};

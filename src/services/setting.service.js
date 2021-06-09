const { Setting } = require('../models');

const getSettingByKey = (key) => {
  return Setting.findOne({ key });
};

const createSetting = async (key, value) => {
  const result = await getSettingByKey(key);
  if (result) {
    throw new Error('Duplicated setting pair');
  }
  const settingPair = await Setting.create({ key, value });
  return settingPair;
};

const updateSettingPair = (key, value) => {
  return Setting.findOneAndUpdate({ key }, { value });
};

module.exports = {
  getSettingByKey,
  createSetting,
  updateSettingPair,
};

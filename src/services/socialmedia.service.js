const { SocialMedia } = require('../models');

const savePlatform = async ({ platform }) => {
  const socialMediaDoc = await SocialMedia.create({ platform });
  return socialMediaDoc;
};

module.exports = {
  savePlatform,
};

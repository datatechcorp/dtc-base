const Joi = require('joi');

const getAccByAddress = {
  query: Joi.object().keys({
    address: Joi.string().required(),
  }),
};

module.exports = {
  getAccByAddress,
};

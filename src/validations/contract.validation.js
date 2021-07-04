const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getContracts = {
  query: Joi.object().keys({
    contrStatus: Joi.string(),
    contrType: Joi.string(),
    contrAddress: Joi.string(),
    contrCreator: Joi.string(),
    tknName: Joi.string(),
    tknSymbol: Joi.string(),
    tknDecimals: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createContract = {
  body: Joi.object().keys({
    contrType: Joi.string().valid('drc20', 'other').required(),
    contrAddress: Joi.string().when('contrType', {
      is: Joi.string().valid('drc20'),
      then: Joi.required(),
    }),
    tknDescriptions: Joi.string().when('contrType', {
      is: Joi.string().valid('drc20'),
      then: Joi.required(),
    }),
    tknLogo: Joi.string().when('contrType', {
      is: Joi.string().valid('drc20'),
      then: Joi.required(),
    }),
    oflWebsite: Joi.string().when('contrType', {
      is: Joi.string().valid('drc20'),
      then: Joi.required(),
    }),
    email: Joi.string().when('contrType', {
      is: Joi.string().valid('drc20'),
      then: Joi.required(),
    }),
    github: Joi.string(),
    whitepaper: Joi.string(),
    links: Joi.object().keys({
      platforms: Joi.array().items(Joi.string()),
      entries: Joi.object(),
    }),
    signature: Joi.string().required(),
  }),
};

const updateContractInfo = {
  body: Joi.object().keys({
    contrId: Joi.required().custom(objectId),
    tknDescriptions: Joi.string(),
    tknLogo: Joi.string(),
    oflWebsite: Joi.string(),
    email: Joi.string(),
    github: Joi.string(),
    whitepaper: Joi.string(),
    links: Joi.object().keys({
      platforms: Joi.array().items(Joi.string()),
      entries: Joi.object(),
    }),
    signature: Joi.string().required(),
  }),
};

const updateContract = {
  params: Joi.object().keys({
    contrId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    contrStatus: Joi.string().valid('pending', 'verified', 'rejected'),
    tknDescriptions: Joi.string(),
    tknLogo: Joi.string(),
    oflWebsite: Joi.string(),
    email: Joi.string(),
    github: Joi.string(),
    whitepaper: Joi.string(),
    links: Joi.object().keys({
      platforms: Joi.array().items(Joi.string()),
      entries: Joi.object(),
    }),
  }),
};

module.exports = {
  getContracts,
  createContract,
  updateContractInfo,
  updateContract,
};

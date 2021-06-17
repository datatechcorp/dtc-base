const httpStatus = require('http-status');
const DtcSdk = require('dtc-node-sdk');
const crypto = require('crypto');
const { ApiError } = require('../utils');
const { Account } = require('../models');
const config = require('../config/config');

const {
  blockchain: { fullNodeHost, solidityNodeHost, eventServerHost },
} = config;

const getAccByAddress = async (address) => {
  const sdk = await new DtcSdk(
    fullNodeHost,
    solidityNodeHost,
    eventServerHost,
    crypto.createHash('sha256').update(Math.random().toString()).digest().toString('hex')
  );
  if (!sdk.isAddress(address)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid address');
  }
  return Account.findOne({ address }).populate('contracts');
};

const getAccById = async (id) => {
  return Account.findById(id);
};

const createAcc = async (accBody) => {
  let acc = await getAccByAddress(accBody.address);
  if (!acc) {
    acc = await Account.create(accBody);
  }
  return acc;
};

const queryAccounts = async (filter, options) => {
  const accounts = Account.paginate(filter, options);
  return accounts;
};

const updateAccById = async (accId, updateBody) => {
  const acc = await getAccById(accId);
  if (!acc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  if (updateBody.address && (await Account.isAddressTaken(updateBody.address, accId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Address already taken');
  }
  Object.assign(acc, updateBody);
  await acc.save();
  return acc;
};

module.exports = {
  getAccByAddress,
  getAccById,
  createAcc,
  queryAccounts,
  updateAccById,
};

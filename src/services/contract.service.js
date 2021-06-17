const httpStatus = require('http-status');
const DtcSdk = require('dtc-node-sdk');
const crypto = require('crypto');
const config = require('../config/config');
const { ApiError } = require('../utils');
const { Contract } = require('../models');

const {
  blockchain: { fullNodeHost, solidityNodeHost, eventServerHost },
} = config;

const createContract = async (contrBody) => {
  if (await Contract.isContrAddressTaken(contrBody.contrAddress)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract already verified');
  }
  const sdk = await new DtcSdk(
    fullNodeHost,
    solidityNodeHost,
    eventServerHost,
    crypto.createHash('sha256').update(Math.random().toString()).digest().toString('hex')
  );
  const deployedContr = await sdk.contract.at(contrBody.contrAddress);
  const hexMessage = sdk.toHex(contrBody.contrAddress + deployedContr.originAddress);
  if (!(await sdk.dtc.verifyMessage(hexMessage, contrBody.signature, contrBody.contrCreator))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid signature');
  }
  const tknMethods = ['name', 'symbol', 'decimals', 'totalSupply'];
  const result = await Promise.all(tknMethods.map((method) => deployedContr[method].call()));
  Object.assign(contrBody, {
    tknName: result[0],
    tknSymbol: result[1],
    tknDecimals: result[2],
    tknTotalSupply: result[3].toString(),
  });
  const contract = await Contract.create(contrBody);
  return contract;
};

const queryContracts = async (filter, options) => {
  const contracts = await Contract.paginate(filter, options);
  return contracts;
};

const updateContractById = async (contrId, updateBody) => {
  const contract = await Contract.findById(contrId);
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found');
  }
  if (updateBody.contrAddress && (await Contract.isContrAddressTaken(updateBody.contrAddress, contrId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid contract address');
  }
  Object.assign(contract, updateBody);
  await contract.save();
  return contract;
};

module.exports = {
  createContract,
  queryContracts,
  updateContractById,
};

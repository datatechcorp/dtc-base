const httpStatus = require('http-status');
const { pick, catchAsync } = require('../utils');
const { contrService } = require('../services');

const createContract = catchAsync(async (req, res) => {
  const contract = await contrService.createContract(req.body);
  res.status(httpStatus.CREATED).send(contract);
});

const getContracts = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'contrStatus',
    'contrType',
    'contrAddress',
    'contrCreator',
    'tknName',
    'tknSymbol',
    'tknDecimals',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await contrService.queryContracts(filter, options);
  res.send(result);
});

const updateContract = catchAsync(async (req, res) => {
  const contrId = req.params.contrId || req.body.contrId;
  if (req.body.contrId) {
    delete req.body.contrId;
  }
  const contract = await contrService.updateContractById(contrId, req.body);
  res.send(contract);
});

module.exports = {
  createContract,
  getContracts,
  updateContract,
};

const { catchAsync } = require('../utils');
const { accService } = require('../services');

const getAccByAddress = catchAsync(async (req, res) => {
  const account = await accService.createAcc({ address: req.query.address });
  res.send(account);
});

module.exports = {
  getAccByAddress,
};

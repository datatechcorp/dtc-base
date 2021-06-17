const { catchAsync } = require('../utils');
const { accService } = require('../services');

const getAccByAddress = catchAsync(async (req, res) => {
  const account = await accService.getAccByAddress(req.query.account);
  res.send(account);
});

module.exports = {
  getAccByAddress,
};

const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { contrValidation } = require('../../validations');
const { contrController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(validate(contrValidation.createContract), contrController.createContract)
  .get(auth('getContracts'), validate(contrValidation.getContracts), contrController.getContracts)
  .patch(validate(contrValidation.updateContractInfo), contrController.updateContract);

router
  .route('/:contrId')
  .patch(auth('manageContracts'), validate(contrValidation.updateContract), contrController.updateContract);

module.exports = router;

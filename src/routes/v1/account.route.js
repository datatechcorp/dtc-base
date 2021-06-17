const express = require('express');
const validate = require('../../middlewares/validate');
const { accController } = require('../../controllers');
const { accValidation } = require('../../validations');

const router = express.Router();

router.route('/').get(validate(accValidation.getAccByAddress), accController.getAccByAddress);

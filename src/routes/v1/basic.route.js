const express = require('express');
const path = require('path');
const { uploadImg } = require('../../middlewares/upload');
const { catchAsync } = require('../../utils');

const router = express.Router();

router.use('/upload', express.static(path.join(__dirname, '../../../public/uploads/')));

router.route('/upload').post(
  uploadImg('image'),
  catchAsync(async (req, res) => {
    res.send(req.file.filename);
  })
);

module.exports = router;

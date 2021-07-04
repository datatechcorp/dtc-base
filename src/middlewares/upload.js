/* eslint-disable security/detect-non-literal-fs-filename */
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mkdirp = require('mkdirp');
const httpStatus = require('http-status');
const logger = require('../config/logger');
const { ApiError } = require('../utils');

function toDir(dir) {
  return path.join(__dirname, '../../', dir);
}

const privateDir = toDir('private/images/');
const publicDir = toDir('public/uploads/');

const privateStorage = multer.diskStorage({
  destination(req, file, cb) {
    if (fs.existsSync(privateDir)) {
      cb(null, privateDir);
    } else {
      mkdirp(privateDir)
        .then(() => {
          cb(null, privateDir);
        })
        .catch((err) => {
          cb(err, null);
        });
    }
  },
  filename(req, file, cb) {
    const filename = `${new Date().getTime()}.${req.user._id}.${file.fieldname}.${file.mimetype.split('/')[1]}`;
    cb(null, filename);
  },
});

const publicStorage = multer.diskStorage({
  destination(req, file, cb) {
    if (fs.existsSync(publicDir)) {
      cb(null, publicDir);
    } else {
      mkdirp(publicDir, {}, (err) => {
        if (err) {
          logger.error(`Init public storage >> Error: ${err}`);
        } else {
          cb(null, publicDir);
        }
      });
    }
  },
  filename(req, file, cb) {
    const filename = `${new Date().getTime()}.${file.originalname}.${file.mimetype.split('/')[1]}`;
    cb(null, filename);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Invalid mime'));
  }
};

const upload = (storage) =>
  multer({
    limits: { fileSize: 1024 * 1024 * 10 },
    storage,
    fileFilter,
  });

const uploadIdentity = upload(privateStorage).fields([
  { name: 'identity_front_img', maxCount: 1 },
  { name: 'identity_back_img', maxCount: 1 },
  { name: 'selfie_img', maxCount: 1 },
]);

const uploadImg = (fieldname) => upload(publicStorage).single(fieldname);
const uploadImgs = (fieldname) => upload(publicStorage).array(fieldname);

module.exports = {
  uploadIdentity,
  uploadImg,
  uploadImgs,
};

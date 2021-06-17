const mongoose = require('mongoose');
const { modelList } = require('../config/database');
const { toJSON } = require('./plugins');

const socialMediaSchema = mongoose.Schema(
  {
    platform: {
      type: String,
      trim: true,
      required: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    inactiveLogo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

socialMediaSchema.plugin(toJSON);

const SocialMedia = mongoose.model(modelList.SocialMedia, socialMediaSchema, modelList.SocialMedia);

module.exports = SocialMedia;

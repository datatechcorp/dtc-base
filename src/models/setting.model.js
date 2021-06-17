const mongoose = require('mongoose');
const { modelList } = require('../config/database');
const { toJSON } = require('./plugins');

const settingSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
settingSchema.plugin(toJSON);

/**
 * @typedef Setting
 */
const Setting = mongoose.model(modelList.Setting, settingSchema, modelList.Setting);

module.exports = Setting;

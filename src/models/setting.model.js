const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const settingSchema = mongoose.Schema(
  {
    key: {
      type: String,
      require: true,
      index: true,
    },
    value: {
      type: String,
      require: true,
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
const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;

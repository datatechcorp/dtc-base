const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { contrTypes, contrStatus } = require('../config/contract');
const { modelList } = require('../config/database');

const contractSchema = mongoose.Schema(
  {
    contrStatus: {
      type: String,
      enum: contrStatus,
      default: 'pending',
      index: true,
    },
    contrType: {
      type: String,
      enum: contrTypes,
      default: 'drc20',
      index: true,
    },
    // DRC20 payload
    contrAddress: {
      type: String,
      unique: true,
      trim: true,
    },
    contrCreator: {
      type: String,
      trim: true,
    },
    tknName: {
      type: String,
      trim: true,
    },
    tknSymbol: {
      type: String,
      trim: true,
    },
    tknDecimals: {
      type: Number,
      trim: true,
    },
    tknTotalSupply: {
      type: String,
      trim: true,
    },
    tknDescriptions: {
      type: String,
      trim: true,
    },
    tknIssuer: {
      type: String,
      trim: true,
    },
    tknLogo: {
      type: String,
      trim: true,
    },
    oflWebsite: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    whitepaper: {
      type: String,
      trim: true,
    },
    links: {
      type: {
        ids: [
          {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'SocialMedia',
          },
        ],
        entries: {
          type: Object,
          default: {
            // [_id]: [link,link, ...]
          },
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

contractSchema.plugin(toJSON);
contractSchema.plugin(paginate);

contractSchema.statics.isContrAddressTaken = async function (address, excludedAccId) {
  const acc = await this.findOne({ address, _id: { $ne: excludedAccId } });
  return !!acc;
};

const Contract = mongoose.model(modelList.Contract, contractSchema, modelList.Contract);

module.exports = Contract;

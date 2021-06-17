const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { modelList } = require('../config/database');

const accountSchema = mongoose.Schema(
  {
    address: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      index: true,
    },
    contracts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Contract',
      },
    ],
  },
  {
    timestamps: true,
  }
);

accountSchema.plugin(toJSON);
accountSchema.plugin(paginate);

accountSchema.statics.isAddressTaken = async function (address, excludedAccId) {
  const acc = await this.findOne({ address, _id: { $ne: excludedAccId } });
  return !!acc;
};

const Account = mongoose.model(modelList.Account, accountSchema, modelList.Account);

module.exports = Account;

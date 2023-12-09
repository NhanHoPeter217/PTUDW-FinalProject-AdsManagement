const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertisingLicenseRequestSchema = new Schema({
  advertisingBoard: {
    type: Schema.Types.ObjectId,
    ref: "AdvertisingBoard",
    required: true,
  },
  advertisingPoint: {
    type: Schema.Types.ObjectId,
    ref: "AdvertisingPoint",
    required: true,
  },
  companyInfo: {
    name: { type: String, required: true },
    contact: {
      email: { type: String, required: true },
      phone: { type: String },
      address: { type: String },
    },
  },
  contractStartDate: { type: Date, required: true },
  contractEndDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Canceled"],
    default: "Pending",
  },
});

const AdvertisingLicenseRequest = mongoose.model(
  "AdvertisingLicenseRequest",
  advertisingLicenseRequestSchema,
);

module.exports = AdvertisingLicenseRequest;

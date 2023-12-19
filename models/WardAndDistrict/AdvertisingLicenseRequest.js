const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertisingLicenseRequestSchema = new Schema(
  {
    advertisingBoard: {
      type: Schema.Types.ObjectId,
      ref: "AdvertisingBoard",
      required: true,
    },

    advertisingContent: {
      type: String,
      required: true,
    },

    illstrationImage: [{ type: String }],

    companyInfo: {
      name: { type: String, required: true },
      contact: {
        email: { type: String, required: true },
        phone: { type: String },
        address: { type: String },
      },
    },

    contractStartDate: {
      type: Date,
      required: true,
    },

    contractEndDate: {
      type: Date,
      required: true,
    },

    ActiveStatus: {
      type: String,
      enum: ["Đang tồn tại, Đã hủy bỏ"],
      default: "Đang tồn tại",
    },

    requestApprovalStatus: {
      type: String,
      enum: ["Chưa được duyệt, Đã được duyệt"],
      default: "Chưa được duyệt",
    },
    
    location: {
      ward: {
        type: "String",
      },

      district: {
        type: "String",
        required: true,
      },
    }
  },
  { timestamps: true },
);

const AdvertisingLicenseRequest = mongoose.model(
  "AdvertisingLicenseRequest",
  advertisingLicenseRequestSchema,
);

module.exports = AdvertisingLicenseRequest;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdsInfoEditingRequestSchema = new Schema({

  advertisingObject: {
    type: Schema.Types.ObjectId,
    refPath: 'advertisingType',
  },

  advertisingType: {
    type: String,
    enum: ["AdvertisingBoard", "AdvertisingPoint"],
    required: true,
  },
  
  newInfo: { 
    type: Schema.Types.ObjectId,
    ref: "AdvertisingPoint",
    required: true,
  },

  editRequestTime: { type: Date, default: Date.now },

  editReason: { type: String },

  requestApprovalStatus : { 
    type: String,
    enum: ["Chưa được duyệt, Đã được duyệt"], 
    default: "Chưa được duyệt" ,
  },

  },
  { timestamps: true },
);

const AdsInfoEditingRequest = mongoose.model("AdsInfoEditingRequest", AdsInfoEditingRequestSchema);

module.exports = AdsInfoEditingRequest;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const editRequestSchema = new Schema({
  advertisingPoint: {
    type: Schema.Types.ObjectId,
    ref: "AdvertisingPoint",
    required: true,
  },
  newInfo: { type: String, required: true },
  requestTime: { type: Date, default: Date.now },
  reason: { type: String },
});

const EditRequest = mongoose.model("EditRequest", editRequestSchema);

module.exports = EditRequest;

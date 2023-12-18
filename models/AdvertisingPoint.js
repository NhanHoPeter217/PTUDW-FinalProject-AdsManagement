const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertisingPointSchema = new Schema({
  address: { type: String, required: true },
  area: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  adType: {
    type: String,
    enum: ["Political", "Commercial", "Social"],
    required: true,
  },
  images: [{ type: String }],
  planned: { type: Boolean, default: false },
},
  { timestamps: true },
);

advertisingPointSchema.index({ location: "2dsphere" });

const AdvertisingPoint = mongoose.model(
  "AdvertisingPoint",
  advertisingPointSchema,
);

module.exports = AdvertisingPoint;

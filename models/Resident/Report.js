const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema(
  {
    relatedTo: {
      type: Schema.Types.ObjectId,
      refPath: "relatedToType",
    },

    relatedToType: {
      type: String,
      enum: ["AdsBoard", "AdsPoint", "Location"],
      default: "Location",
    },

    reportFormat: {
      type: Schema.Types.ObjectId,
      ref: "ReportFormat",
      required: true,
    },

    senderName: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Please provide email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    image1: [{ type: String }],
    image2: [{ type: String }],
    
  },
  { timestamps: true },
);

module.exports = mongoose.model("Report", ReportSchema);

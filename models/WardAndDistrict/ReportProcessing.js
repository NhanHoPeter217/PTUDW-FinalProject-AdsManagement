const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportProcessingSchema = new Schema({
  report: { type: Schema.Types.ObjectId, ref: "Report", required: true },

  processedBy: { 
    ward: {
      type: "String",
    },
  
    district: {
      type: "String",
      required: true,
    },
  },

  processingStatus: {
    type: String,
    enum: ["Chưa xử lý", "Đang xử lý", "Đã xử lý"],
    default: "Chưa xử lý",
  },

  processingMethods: { type: String },
  },
  { timestamps: true },
);

const ReportProcessing = mongoose.model(
  "ReportProcessing",
  ReportProcessingSchema,
);

module.exports = ReportProcessing;

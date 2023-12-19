const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const processedReportSchema = new Schema({
  report: { type: Schema.Types.ObjectId, ref: "Report", required: true },

  ward: {
    type: "String",
  },

  district: {
    type: "String",
    required: true,
  },

  processingStatus: {
    type: String,
    enum: ["Chưa xử lý", "Đang xử lý", "Đã xử lý"],
    default: "Chưa xử lý",
  },

  processingMethods: { type: String },
});

const ProcessedReport = mongoose.model(
  "ProcessedReport",
  processedReportSchema,
);

module.exports = ProcessedReport;

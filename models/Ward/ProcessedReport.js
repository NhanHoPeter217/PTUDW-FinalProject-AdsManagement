const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const processedReportSchema = new Schema({
  report: { type: Schema.Types.ObjectId, ref: "Report", required: true },
  processingStatus: {
    type: String,
    enum: ["Processing", "Processed"],
    default: "Processing",
  },
  processingDetails: { type: String },
});

const ProcessedReport = mongoose.model(
  "ProcessedReport",
  processedReportSchema,
);

module.exports = ProcessedReport;

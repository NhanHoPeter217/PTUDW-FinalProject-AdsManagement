const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    reportType: {
      type: String,
      enum: [
        "Tố giác sai phạm",
        "Đăng ký nội dung",
        "Đóng góp ý kiến",
        "Giải đáp thắc mắc",
      ],
      required: true,
    },
    senderName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    content: { type: String, required: true },
    image1: [{ type: String }],
    image2: [{ type: String }],
    processed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;

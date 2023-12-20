const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportFormat = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    // 'Tố giác sai phạm','Đăng ký nội dung','Đóng góp ý kiến', 'Giải đáp thắc mắc',
  },
  { timestamps: true },
);

const adsFormat = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    // Cổ động chính trị, Quảng cáo thương mại, Xã hội hoá
  },
  { timestamps: true },
);

module.exports = {
  ReportFormat: mongoose.model("ReportFormat", ReportFormat),
  AdsFormat: mongoose.model("AdsFormat", adsFormat),
};

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportFormatSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        }
        // 'Tố giác sai phạm','Đăng ký nội dung','Đóng góp ý kiến', 'Giải đáp thắc mắc',
    },
    { timestamps: true }
);

module.exports = mongoose.model('ReportFormat', ReportFormatSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdsFormatSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        }
        // Cổ động chính trị, Quảng cáo thương mại, Xã hội hoá
    },
    { timestamps: true }
);

module.exports = mongoose.model('AdsFormat', AdsFormatSchema);

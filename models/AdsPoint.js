const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adsPointSchema = new Schema(
    {
        location: {
            type: Schema.Types.ObjectId,
            ref: 'Location',
            required: true
        },

        locationType: {
            type: String,
            enum: [
                'Đất công/Công viên/Hành lang an toàn giao thông',
                'Đất tư nhân/Nhà ở riêng lẻ',
                'Trung tâm thương mại',
                'Chợ',
                'Cây xăng',
                'Nhà chờ xe buýt'
            ],
            required: true
        },

        adsFormat: {
            type: Schema.Types.ObjectId,
            ref: 'AdsFormat',
            required: true
        },

        locationImages: [{ type: String }],

        planningStatus: {
            type: String,
            enum: ['Đã quy hoạch', 'Chưa quy hoạch'],
            default: 'Chưa quy hoạch'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('AdsPoint', adsPointSchema);

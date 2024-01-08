const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adsPointRequestedEditSchema = new Schema(
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
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// adsPointRequestedEditSchema.virtual('adsBoard', {
//     ref: 'AdsBoard',
//     localField: '_id',
//     foreignField: 'adsPoint'
// });

module.exports = mongoose.model('AdsPointRequestedEdit', adsPointRequestedEditSchema);

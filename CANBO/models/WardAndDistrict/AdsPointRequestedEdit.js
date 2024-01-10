const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adsPointRequestedEditSchema = new Schema(
    {
        coords: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        locationName: { type: String, required: true },

        address: { type: String, required: true },

        ward: { type: String, required: true },

        district: { type: String, required: true },

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

adsPointRequestedEditSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'adsFormat',
        select: 'name'
    });
    next();
});

module.exports = mongoose.model('AdsPointRequestedEdit', adsPointRequestedEditSchema);

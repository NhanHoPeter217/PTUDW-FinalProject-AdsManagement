const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adsPointSchema = new Schema(
    {
        location: {
            type: Schema.Types.ObjectId,
            ref: 'Location',
            required: true,
            unique: true
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

adsPointSchema.virtual('adsBoard', {
    ref: 'AdsBoard',
    localField: '_id',
    foreignField: 'adsPoint'
});

adsPointSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'adsFormat',
        select: 'name'
    });
    next();
});

// adsPointSchema.pre(/^find/, function(next) {

//     if (this.options._recursed) {
//         return next();
//     }

//     this.populate({
//         path: "location",
//         model: "Location",
//         select: "ward district",
//         options: { _recursed: true }
//     });
//     console.log('Middleware pre-find of AdsPoint executed before find operation');
//     next();
// });

module.exports = mongoose.model('AdsPoint', adsPointSchema);

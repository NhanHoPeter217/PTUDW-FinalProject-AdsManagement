const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const adsBoardSchema = new Schema(
    {
        adsPoint: {
            type: Schema.Types.ObjectId,
            ref: 'AdsPoint',
            required: true
        },

        adsBoardType: {
            type: String,
            enum: [
                'Trụ bảng hiflex',
                'Trụ màn hình điện tử LED',
                'Trụ hộp đèn',
                'Bảng hiflex ốp tường',
                'Màn hình điện tử ốp tường',
                'Trụ treo băng rôn dọc',
                'Trụ treo băng rôn ngang',
                'Trụ/Cụm pano',
                'Cổng chào',
                'Trung tâm thương mại'
            ]
        },
        size: {
            width: { type: Number },
            height: { type: Number }
        },

        quantity: { type: Number, default: 1 },

        adsBoardImages: [{ type: String }],

        contractEndDate: { type: String }
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

adsBoardSchema.virtual('licenseRequestedAdsBoard', {
    ref: 'LicenseRequestedAdsBoard',
    localField: '_id',
    foreignField: 'adsBoard'
});

// adsBoardSchema.pre(/^find/, function (next) {

//     this.populate({
//         path: 'adsPoint',
//         model: 'AdsPoint',
//         populate: {
//             path: 'adsPoint.location',
//             model: 'Location',
//             select: 'ward district'
//         },
//     });
//     console.log('Middleware pre-find of AdsBoard executed before find operation');
//     next();
// });

module.exports = mongoose.model('AdsBoard', adsBoardSchema);

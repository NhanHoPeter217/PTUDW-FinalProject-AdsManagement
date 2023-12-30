const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
            width: { type: Number, required: true },
            height: { type: Number, required: true }
        },

        quantity: { type: Number, required: true, default: 1 },

        adsBoardImages: [{ type: String }],

        contractEndDate: { type: Date, required: true }
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }  }
);

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

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const licenseRequestedAdsBoardSchema = new Schema(
    {
        adsBoard: {
            type: Schema.Types.ObjectId,
            ref: 'AdsBoard',
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

        contractEndDate: { type: String, required: true }
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

licenseRequestedAdsBoardSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'adsPoint'
    });
    next();
});

module.exports = mongoose.model('LicenseRequestedAdsBoard', licenseRequestedAdsBoardSchema);

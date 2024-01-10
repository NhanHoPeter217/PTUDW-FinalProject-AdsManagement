const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adsLicenseRequestSchema = new Schema(
    {
        licenseRequestedAdsBoard: {
            type: Schema.Types.ObjectId,
            ref: 'LicenseRequestedAdsBoard',
            required: true
        },

        adsContent: {
            type: String,
            required: true
        },

        companyInfo: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String },
            address: { type: String }
        },

        contractStartDate: {
            type: String,
            required: true
        },

        activeStatus: {
            type: String,
            enum: ['Đang tồn tại', 'Đã hủy bỏ'],
            default: 'Đang tồn tại'
        },

        requestApprovalStatus: {
            type: String,
            enum: ['Chưa được duyệt', 'Đã được duyệt'],
            default: 'Chưa được duyệt'
        },

        wardAndDistrict: {
            ward: {
                type: 'String'
            },

            district: {
                type: 'String',
                required: true
            }
        }
    },
    { timestamps: true }
);

adsLicenseRequestSchema.pre(/^find/, function (next) {
    this.find({ ActiveStatus: { $ne: 'Đã hủy bỏ' } });
    this.populate({
        path: 'licenseRequestedAdsBoard'
    });
    next();
});

const AdsLicenseRequest = mongoose.model('AdsLicenseRequest', adsLicenseRequestSchema);

module.exports = AdsLicenseRequest;

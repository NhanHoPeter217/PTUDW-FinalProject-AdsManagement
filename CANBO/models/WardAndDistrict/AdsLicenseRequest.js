const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adsLicenseRequestSchema = new Schema(
    {
        adsBoard: {
            type: Schema.Types.ObjectId,
            ref: 'AdsBoard',
            required: true
        },

        adsContent: {
            type: String,
            required: true
        },

        illstrationImage: [{ type: String }],

        companyInfo: {
            name: { type: String, required: true },
            contact: {
                email: { type: String, required: true },
                phone: { type: String },
                address: { type: String }
            }
        },

        contractStartDate: {
            type: Date,
            required: true
        },

        contractEndDate: {
            type: Date,
            required: true
        },

        ActiveStatus: {
            type: String,
            enum: ['Đang tồn tại, Đã hủy bỏ'],
            default: 'Đang tồn tại'
        },

        requestApprovalStatus: {
            type: String,
            enum: ['Chưa được duyệt, Đã được duyệt'],
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

const AdsLicenseRequest = mongoose.model('AdsLicenseRequest', adsLicenseRequestSchema);

module.exports = AdsLicenseRequest;
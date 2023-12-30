const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdsInfoEditingRequestSchema = new Schema(
    {
        adsObject: {
            type: Schema.Types.ObjectId,
            refPath: 'adsType'
        },

        adsType: {
            type: String,
            enum: ['AdsBoard', 'AdsPoint'],
            required: true
        },

        newInfo: {
            type: Schema.Types.ObjectId,
            refPath: 'adsType',
            required: true
        },

        editRequestTime: { type: Date, default: Date.now },

        editReason: { type: String },

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

const AdsInfoEditingRequest = mongoose.model('AdsInfoEditingRequest', AdsInfoEditingRequestSchema);

module.exports = AdsInfoEditingRequest;

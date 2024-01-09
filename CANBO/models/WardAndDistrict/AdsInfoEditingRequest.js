const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const AdsInfoEditingRequestSchema = new Schema(
    {
        adsObject: {
            type: Schema.Types.ObjectId,
            refPath: 'adsType',
            required: true
        },

        adsType: {
            type: String,
            enum: ['AdsBoard', 'AdsPoint'],
            required: true
        },

        newInfo: {
            type: Schema.Types.ObjectId,
            refPath: 'adsNewInfoType',
            required: true
        },

        adsNewInfoType: {
            type: String,
            enum: ['AdsPointRequestedEdit', 'AdsBoardRequestedEdit'],
        },

        editRequestTime: {
            type: String,
            required: true,
        },

        editReason: { type: String },

        requestApprovalStatus: {
            type: String,
            enum: ['Chưa được duyệt', 'Đã được duyệt'],
            default: 'Chưa được duyệt',
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
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }}
);

AdsInfoEditingRequestSchema.pre('save', function (next) {
    if (this.adsType === 'AdsBoard') {
        this.adsNewInfoType = 'AdsBoardRequestedEdit';
    } else if (this.adsType === 'AdsPoint') {
        this.adsNewInfoType = 'AdsPointRequestedEdit';
    }
    next();
});

const AdsInfoEditingRequest = mongoose.model('AdsInfoEditingRequest', AdsInfoEditingRequestSchema);

module.exports = AdsInfoEditingRequest;

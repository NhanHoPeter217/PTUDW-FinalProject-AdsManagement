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
            enum: ['AdsBoard', 'AdPoint'],
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
            default: () => {
                return moment().format('DD/MM/YYYY');
            },
        },

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

AdsInfoEditingRequestSchema.pre('save', function (next) {
    if (this.adsType === 'AdsBoard') {
        this.adsNewInfoType = 'AdsPointRequestedEdit';
    } else if (this.adsType === 'AdPoint') {
        this.adsNewInfoType = 'AdsBoardRequestedEdit';
    }
    next();
});

const AdsInfoEditingRequest = mongoose.model('AdsInfoEditingRequest', AdsInfoEditingRequestSchema);

module.exports = AdsInfoEditingRequest;

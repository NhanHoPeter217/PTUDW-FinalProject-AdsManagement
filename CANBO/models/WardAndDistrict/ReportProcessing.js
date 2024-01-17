const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportProcessingSchema = new Schema(
    {
        residentID: { type: String /*, required: true */ },

        relatedTo: {
            type: Schema.Types.ObjectId,
            refPath: 'relatedToType'
        },

        relatedToType: {
            type: String,
            enum: ['AdsBoard', 'AdsPoint', 'Location'],
            required: true
        },

        reportFormat: {
            type: Schema.Types.ObjectId,
            ref: 'ReportFormat',
            required: true
        },

        senderName: { type: String, required: true },

        email: {
            type: String,
            required: [true, 'Please provide email'],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please provide a valid email'
            ]
        },

        phone: {
            type: String
        },

        content: {
            type: String,
            required: true
        },

        images: [{ type: String }],

        processingStatus: {
            type: String,
            enum: ['Chưa xử lý', 'Đang xử lý', 'Đã xử lý'],
            default: 'Chưa xử lý'
        },

        processingMethod: { type: String },

        coords: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },

        ward: {
            type: 'String'
        },

        district: {
            type: 'String',
            required: true
        }
    },
    { timestamps: true }
);

ReportProcessingSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'reportFormat',
        select: 'name'
    });
    next();
});

const ReportProcessing = mongoose.model('ReportProcessing', ReportProcessingSchema);

module.exports = ReportProcessing;

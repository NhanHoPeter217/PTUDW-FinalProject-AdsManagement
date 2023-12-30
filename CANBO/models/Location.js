const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema(
    {
        coords: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },

        locationName: { type: String, required: true },

        address: { type: String, required: true },

        ward: { type: String, required: true },

        district: { type: String, required: true }
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

locationSchema.virtual('adsPoint', {
    ref: 'AdsPoint',
    localField: '_id',
    foreignField: 'location',
    justOne: true
});

// locationSchema.pre(/^find/, function(next) {
//     this.populate({
//         path: 'adsPoint',
//         model: 'AdsPoint',
//         populate: {
//             path: 'adsBoard',
//             model: 'AdsBoard'
//         }
//     });
//     console.log('Middleware pre-find of Location executed before find operation');
//     next();
// });

module.exports = mongoose.model('Location', locationSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const locationSchema = new Schema({
    coordinate: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },

    locationName: { type: String, required: true },

    address: { type: String, required: true },
    
    ward: { type: String, required: true },

    district: { type: String, required: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Location", locationSchema);
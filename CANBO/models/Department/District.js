const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    districtName: { type: String, required: true },
    wards: [{ type: String, required: true }]
});

const District = mongoose.model('District', districtSchema);

module.exports = District;

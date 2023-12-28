const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    districtName: { type: String, required: true },
    wards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ward' }]
});

const District = mongoose.model('District', districtSchema);

module.exports = District;
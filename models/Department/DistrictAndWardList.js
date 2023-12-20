const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  wardName: { type: String, required: true },
});

const districtSchema = new mongoose.Schema({
  districtName: { type: String, required: true },
  wards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ward' }],
});

const Ward = mongoose.model('Ward', wardSchema);
const District = mongoose.model('District', districtSchema);

module.exports = { Ward, District };

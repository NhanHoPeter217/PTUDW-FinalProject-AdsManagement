const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
    wardName: { type: String, required: true }
});

const Ward = mongoose.model('Ward', wardSchema);

module.exports = Ward;

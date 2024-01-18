const District = require('../CANBO/models/Department/District');
require('dotenv').config({ path: '../.env' });
const connectDB = require('../CANBO/db/connect');
const fs = require('fs');

async function districtImport() {
    await connectDB(process.env.MONGO_URI);

    // Read the CSV file
    const csvData = fs.readFileSync('./district.csv', 'utf-8');

    // Split the CSV lines
    const lines = csvData.split('\r\n');

    // Iterate over each line and split the values
    const rows = lines.map((line) => line.split(','));

    // Use the commaSeparatedRows as needed
    let districtArr = [];
    let districtObj = {};
    for (let row of rows) {
        // console.log(row);
        if (row[0] !== districtObj.districtName) {
            // new district
            districtArr.push(structuredClone(districtObj));
            districtObj.districtName = row[0];
            districtObj.wards = [];
            districtObj.wards.push(row[1]);
        } else {
            // same district
            districtObj.wards.push(row[1]);
        }
    }
    districtArr.shift();
    District.create(districtArr, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log('Multiple documents inserted to Collection');
        }
    });
}
districtImport();

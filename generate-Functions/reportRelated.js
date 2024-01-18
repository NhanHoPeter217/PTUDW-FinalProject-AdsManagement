const Location = require('CANBO/models/Location');
const AdsPoint = require('CANBO/models/AdsPoint');
const AdsFormat = require('CANBO/models/Department/AdsFormat.js');
require('dotenv').config({ path: '../.env' });
const connectDB = require('CANBO/db/connect');

async function reportRelated() {
    await connectDB(process.env.MONGO_URI);

    // Traverse through all documents in the 'locations' collection and update 'reportRelated' field
    const adsPoints = await AdsPoint.find({}).lean();
    const locations = await Location.find({}).lean();

    for (let doc of locations) {
        // Check if location isnt included in adspoints
        try {
            if (
                adsPoints.some(
                    (adspoint) => adspoint.location.toString() === doc._id.toString()
                ) === false
            ) {
                console.log('Location ' + doc._id + ' is not included in any adspoint');
                await Location.findByIdAndUpdate(doc._id, { reportRelated: true });
            } else {
                console.log('Included', doc._id);
                await Location.findByIdAndUpdate(doc._id, { reportRelated: false });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
reportRelated();

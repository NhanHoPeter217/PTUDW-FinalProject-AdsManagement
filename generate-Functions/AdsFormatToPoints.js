const AdsPoint = require('CANBO\\models\\AdsPoint.js');
const AdsFormat = require('CANBO\\models\\Department\\AdsFormat.js');

require('dotenv').config({ path: '../.env' });
const connectDB = require('CANBO\\db\\connect');

async function getAllFormats() {
    const formats = await AdsFormat.find({}).lean();
    return formats;
}

async function getRandomFormatId(formats) {
    const randomFormat = formats[Math.floor(Math.random() * formats.length)];
    return randomFormat._id;
}

async function adsFormat() {
    await connectDB(process.env.MONGO_URI);

    const formats = await getAllFormats();

    const adsPoints = await AdsPoint.find({}).lean();
    for (const adsPoint of adsPoints) {
        const randomFormatId = await getRandomFormatId(formats);
        await AdsPoint.findByIdAndUpdate(adsPoint._id, { adsFormat: randomFormatId });
    }
}

try {
    adsFormat();
} catch (error) {
    console.log(error);
}

const fs = require('fs');
require('dotenv').config({ path: '../.env' });
const connectDB = require('./db/connect');

const AdvertisingBoard = require('./models/AdsBoard');
const AdvertisingPoint = require('./models/AdsPoint');
const LocationModel = require('./models/Location');
const AdvertisingFormat = require('./models/Department/AdsFormat');
const mongoose = require('mongoose');

/* Mô tả dữ liệu như sau:

    1 LOCATION là 'Trung tâm thương mại', tương ứng với 1 POINT ,
    Có 10 BOARD rải khắp bên trong, mỗi BOARD có quantity >= 1
    
    Vậy khi tạo BOARD chú ý xác định LOCATION && POINT mà board đó thuộc về.

*/

// Define temp functions
async function getRandomFormatId() {
    const list = ['Cổ động chính trị', 'Quảng cáo thương mại', 'Xã hội hoá'];

    let res = await AdvertisingFormat.findOne({
        name: list[Math.floor(Math.random() * list.length)]
    }).exec();
    console.log('id:', res._id);
    return res._id;
}

// Loop to create points
let fullData = fs.readFileSync('./full2.json', { encoding: 'utf8' });
fullData = JSON.parse(fullData);

connectDB(process.env.MONGO_URI).then(() => {
    fullData.forEach(async (point) => {
        // Skip if ward or district is empty
        if (point.ward == '' || point.district == '') return;

        // Skip if district is not 1 or 3
        const allowDistricts = ['1', '3', '10'];
        if (!allowDistricts.includes(point.district)) return;

        // Number of boards each point has (1-4)
        let n_boards = Math.floor(Math.random() * 4) + 1;

        // Create boards
        let pointObjectId = new mongoose.Types.ObjectId();
        for (let i = 0; i < n_boards; i++) {
            let newBoard = new AdvertisingBoard({
                adsPoint: pointObjectId,
                adsBoardType:
                    AdvertisingBoard.schema.path('adsBoardType').enumValues[
                        Math.floor(Math.random() * 10)
                    ],
                size: {
                    width: Math.floor(Math.random() * 10) + 1,
                    height: Math.floor(Math.random() * 10) + 1
                },
                contractEndDate: new Date(Date.now() + Math.floor(Math.random() * 1000000000))
            });
            newBoard.save();
        }

        // Create location
        let newLocation = new LocationModel({
            coords: {
                lat: point.coords.lat,
                lng: point.coords.lng
            },
            locationName: point.title,
            address: point.address,
            ward: point.ward,
            district: point.district
        });

        let newPoint = new AdvertisingPoint({
            _id: pointObjectId,
            location: newLocation._id,
            locationType:
                AdvertisingPoint.schema.path('locationType').enumValues[
                    Math.floor(Math.random() * 6)
                ],
            adsFormat: await getRandomFormatId(),
            planningStatus:
                AdvertisingPoint.schema.path('planningStatus').enumValues[
                    Math.floor(Math.random() * 3)
                ]
        });

        newLocation.save();
        newPoint.save();
    });
});

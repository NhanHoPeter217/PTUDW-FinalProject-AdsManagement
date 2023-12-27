require('dotenv').config();
const connectDB = require('./db/connect');
const { AdvertisingFormat } = require('./models/Department/EnumList');
const mongoose = require('mongoose');

const list = ['Cổ động chính trị', 'Quảng cáo thương mại', 'Xã hội hoá'];

connectDB(process.env.MONGO_URI).then(() => {
    list.forEach((item) => {
        AdvertisingFormat.create({ name: item });
    });
});

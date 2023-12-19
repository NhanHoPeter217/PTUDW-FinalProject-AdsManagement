const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coordsSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const sizeSchema = new Schema({
  w: { type: Number, required: true },
  h: { type: Number, required: true },
});

const advertisingPointSchema = new Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['Chuyển hình Rolling',
    'Biển quảng cáo động Trivision',
    'Biển quảng cáo điện tử',
    'Biển quảng cáo đèn LED',
    'Pano ốp tường',
    'Billboard - Biển lớn một cột',
    'Lightbox - Biển hộp đèn'
   ],
    required: false,
  },
  info: {
    type: String,
    enum: ['Cổ động chính trị',
         'Thực phẩm',
         'Dịch vụ',
         'Giải trí',
         'Thể thao',
         'Nghỉ dưỡng',
         'Vật dụng',
         'Y tế'
        ],
    required: false,
  },
  coords: coordsSchema,
  address: { type: String, required: true },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  size: sizeSchema,
  images: [{ type: String }],
  status: { type: Boolean, default: false },
  n: { type: Number, default: 1 },
});


const AdvertisingPoint = mongoose.model(
  "AdvertisingPoint",
  advertisingPointSchema,
);

module.exports = AdvertisingPoint;
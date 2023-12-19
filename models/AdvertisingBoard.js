const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const advertisingBoardSchema = new Schema({

    advertisingPoint: {
        type: Schema.Types.ObjectId,
        ref: "AdvertisingPoint",
        required: true,
    },

    advertisingBoardType: {
        type: String,
        enum: [
            "Trụ bảng hiflex",
            "Trụ màn hình điện tử LED",
            "Trụ hộp đèn",
            "Bảng hiflex ốp tường",
            "Màn hình điện tử ốp tường",
            "Trụ treo băng rôn dọc",
            "Trụ treo băng rôn ngang",
            "Trụ/Cụm pano",
            "Cổng chào",
            "Trung tâm thương mại"
        ]
    },
    size: {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
    },

    quantity: { type: Number, required: true, default: 1 },

    advertisingBoardImages: [{ type: String }],

    contractEndDate: { type: Date, required: true },
    
    },
    { timestamps: true },
);

module.exports = mongoose.model("AdvertisingBoard", advertisingBoardSchema);

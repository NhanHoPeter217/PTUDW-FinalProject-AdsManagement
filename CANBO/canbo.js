require('dotenv').config({ path: '../.env' });
require('express-async-errors');

const express = require('express');
const engineWithHelpers = require('./handlebars');

const app = express();

const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/connect');
const axios = require('axios');

// security and connection
const morgan = require('morgan');
const cors = require('cors');

const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

var whitelist = [
    `http://localhost:${process.env.PORT_NGUOIDAN || 3000}` /** other domains if any */
];
var corsOptions = {
    credentials: true,
    origin: whitelist
};

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Cross-Origin-Resource-Policy', 'same-site');
    next();
});

app.use(cors(corsOptions));

// routers
const authRouter = require('./routes/auth.js');
const jobsRouter = require('./routes/jobs');
const userRouter = require('./routes/userRoutes');
const otpRouter = require('./routes/otp');
const forgotpwRouter = require('./routes/forgotpw');

const adsBoardRouter = require('./routes/Department/adsBoardRoutes');
const adsFormatRouter = require('./routes/Department/adsFormatRoutes');
const adsPointRouter = require('./routes/Department/adsPointRoutes');
const districtRouter = require('./routes/Department/districtRoutes');
const reportFormatRouter = require('./routes/Department/reportFormatRoutes');

const adsInfoEditingRequestRouter = require('./routes/WardAndDistrict/adsInfoEditingRequestRoutes');
const adsLicenseRequestRouter = require('./routes/WardAndDistrict/adsLicenseRequestRoutes');
const reportProcessingRouter = require('./routes/WardAndDistrict/reportProcessingRoutes');
const locationRouter = require('./routes/locationRoutes');

// const adsBoardRoute = require('./routes/ads-board.route');
const requestRouter = require('./routes/request.route');
const typeRouter = require('./routes/typeRoutes.js');
const adsBoardRoutes = require('./routes/Department/adsBoardRoutes.js');
// import wardRoute from './routes/ward.route.js';
// import districtRoute from './routes/district.route.js';

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { lang } = require('moment');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static('public'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// routes
app.use('/auth', authRouter);
app.use('/api/v1/otp', otpRouter);
app.use('/api/v1/forgotpassword', forgotpwRouter);
app.use('/report', reportProcessingRouter);

// routes after login
app.use('/api/v1/jobs', jobsRouter);
app.use('/api/v1/user', userRouter);

app.use('/adsBoard', adsBoardRouter);
app.use('/adsPoint', adsPointRouter);
app.use('/district', districtRouter);
app.use('/types', typeRouter);
app.use('/api/v1/adsFormat', adsFormatRouter);
app.use('/api/v1/reportFormat', reportFormatRouter);
app.use('/api/v1/adsInfoEditingRequest', adsInfoEditingRequestRouter);
app.use('/adsLicenseRequest', adsLicenseRequestRouter);
app.use('/api/v1/location', locationRouter); // Không xóa để NGUOIDAN xài

// FRONT END
// Setup handlebars view engine
// sectionHandler(engine);

app.engine('hbs', engineWithHelpers);

// Basic setup
app.set('view engine', 'hbs');
app.set('views', './views');
app.set('title', 'Ads Management');

// Get pages
app.get('/', async (req, res) => {
    async function getAllAdsPoints() {
        try {
            var result = await axios.get(`http://localhost:4000/adsPoint/allPoints/api/v1`);
            let AdsPoints = result.data.adsPoints;

            let AdsBoards = [];

            AdsPoints.forEach((adsPoint) => {
                AdsBoards.push(...adsPoint.adsBoard);
            });

            return { AdsPoints, AdsBoards };
        } catch (err) {
            console.log(err);
        }
    }
    const { AdsPoints, AdsBoards } = await getAllAdsPoints();
    res.render('home', { AdsPoints, AdsBoards });
});

app.get('/forgotPassword', function (req, res) {
    res.render('commonFeatures/forgotPassword', { layout: false });
});

app.get('/resetPassword', function (req, res) {
    res.render('commonFeatures/resetPassword', { layout: false });
});

app.get('/updateInfo', function (req, res) {
    res.render('commonFeatures/updateInfo', { layout: false });
});

// app.get('/signin', function (req, res) {
//     res.render('commonFeatures/signin', { layout: false });
// });

// app.get('/admin/adsboard/list', function (req, res) {
//     res.render('vwAdsBoard/listAdsBoard', {});
// });

app.get('/admin/adsboard/byAdspoint/:id', function (req, res) {
    const id = req.params.id;
    const idString = id.toString();
    console.log(id);
    res.render('vwAdsBoard/listAdsBoard', { id: id });
});

// app.get('/admin/adspoint/list', function (req, res) {
//     res.render('vwAdsPoint/listAdsPoint', {});
// });

app.get('/types/list', function (req, res) {
    res.render('vwType/listType', { layout: 'canbo_So' });
});

// app.get('/admin/adsboard/license/list', function (req, res) {
//     res.render('vwAdsBoard/listAdsBoard');
// });

// app.get('/admin/adsboard/license/list/manage', function (req, res) {
//     res.render('vwAdsBoard/listAdsBoard');
// });

// app.get('/admin/adsboard/list/manage', function (req, res) {
//     res.render('vwAdsBoard/listAdsBoard');
// });

// app.use('/admin/adspoint', adsPointRoute);

app.get('/ward/:wardId/dist/:distId', function (req, res) {
    res.render('vwReport/listReport', { layout: 'canbo' });
});

app.use('/admin/request', requestRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT_CANBO || 4000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log('Ads Management CAN BO is running at http://localhost:' + port)
        );
    } catch (error) {
        console.log(error);
    }
};

start();

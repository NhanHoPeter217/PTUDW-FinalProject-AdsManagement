require('dotenv').config({ path: '../.env' });
require('express-async-errors');

const express = require('express');
const engineWithHelpers = require('./handlebars');
// var Handlebars = require('handlebars');

const app = express();

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

app.set('trust proxy', 1); // trust first proxy

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Cross-Origin-Resource-Policy', 'same-site');
    next();
});

// app.use(pjax());
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
const typeRouter = require('./routes/typeRoutes.js');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { lang } = require('moment');
const { authenticateUser } = require('./middleware/authentication.js');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static('public'));
app.use(cookieParser(process.env.JWT_SECRET));

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
app.use('/adsInfoEditingRequest', adsInfoEditingRequestRouter);
app.use('/adsLicenseRequest', adsLicenseRequestRouter);
app.use('/api/v1/location', locationRouter); 

// FRONT END
// Setup handlebars view engine
// sectionHandler(engine);
app.engine('hbs', engineWithHelpers);

// Basic setup
app.set('view engine', 'hbs');
app.set('views', './views');
app.set('title', 'Ads Management');

// Get pages
app.get('/forgotPassword', function (req, res) {
    res.render('commonFeatures/forgotPassword', { layout: false });
});

app.get('/resetPassword', function (req, res) {
    res.render('commonFeatures/resetPassword', { layout: false });
});

app.use(authenticateUser);
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

app.get('/updateInfo', function (req, res) {
    res.render('commonFeatures/updateInfo', { layout: false });
});

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

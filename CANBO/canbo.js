require('dotenv').config({ path: '../.env' });
require('express-async-errors');

const express = require('express');
const { engine } = require('express-handlebars');

const app = express();

const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/connect');

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
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const userRouter = require('./routes/userRoutes');
const otpRouter = require('./routes/otp');
const forgotpwRouter = require('./routes/forgotpw');
const reportRouter = require('./routes/WardAndDistrict/reportProcessingRoutes');

const adsBoardRouter = require('./routes/Department/adsBoardRoutes');
const adsFormatRouter = require('./routes/Department/adsFormatRoutes');
const adsPointRouter = require('./routes/Department/adsPointRoutes');
const districtRouter = require('./routes/Department/districtRoutes');
const wardRouter = require('./routes/Department/wardRoutes');
const reportFormatRouter = require('./routes/Department/reportFormatRoutes');

const adsInfoEditingRequestRouter = require('./routes/WardAndDistrict/adsInfoEditingRequestRoutes');
const adsLicenseRequestRouter = require('./routes/WardAndDistrict/adsLicenseRequestRoutes');
const reportProcessingRouter = require('./routes/WardAndDistrict/reportProcessingRoutes');
const locationRouter = require('./routes/locationRoutes');

const reportRoute = require('./routes/report-ward.route');
const adsPointRoute = require('./routes/ads-point.route');
const wardListRoute = require('./routes/ward-list.route');
// const adsBoardRoute = require('./routes/ads-board.route');
const requestRoute = require('./routes/request.route');
const typeRoute = require('./routes/type.route');
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

app.use(express.json());
app.use('/public', express.static('public'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/otp', otpRouter);
app.use('/api/v1/forgotpw', forgotpwRouter);
app.use('/api/v1/report', reportProcessingRouter);

// routes after login
app.use('/api/v1/jobs', jobsRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/report', reportRouter);

app.use('/api/v1/adsBoard', adsBoardRouter);
app.use('/api/v1/adsFormat', adsFormatRouter);
app.use('/api/v1/adsPoint', adsPointRouter);
app.use('/api/v1/district', districtRouter);
app.use('/api/v1/ward', wardRouter);
app.use('/api/v1/reportFormat', reportFormatRouter);
app.use('/api/v1/adsInfoEditingRequest', adsInfoEditingRequestRouter);
app.use('/api/v1/adsLicenseRequest', adsLicenseRequestRouter);
app.use('/api/v1/reportProcessing', reportProcessingRouter);
app.use('/api/v1/location', locationRouter);

// FRONT END
// Setup handlebars view engine
// sectionHandler(engine);

app.engine(
    'hbs',
    engine({
        extname: 'hbs',
        defaultLayout: 'canbo',
        helpers: {
            section: function section(name, options) {
                var helper = this;
                if (!this._sections) {
                    this._sections = {};
                    this._sections._get = function (arg) {
                        if (typeof helper._sections[arg] === 'undefined') {
                            throw new Error('The section "' + arg + '" is required.');
                        }
                        return helper._sections[arg];
                    };
                }
                if (!this._sections[name]) {
                    this._sections[name] = options.fn(this);
                }

                return null;
            }
        }
    })
);

// Basic setup
app.set('view engine', 'hbs');
app.set('views', './views');
app.set('title', 'Ads Management');

// Get pages
app.get('/', (req, res) => {
    res.render('home', { hideNavbar: true });
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

app.get('/signin', function (req, res) {
    res.render('commonFeatures/signin', { layout: false });
});

app.get('/admin/adsboard/list', function (req, res) {
    res.render('vwAdsBoard/listAdsBoard', {});
});

app.get('/admin/adsboard/byAdspoint/:id', function (req, res) {
    const id = req.params.id;
    const idString = id.toString();
    console.log(id);
    res.render('vwAdsBoard/listAdsBoard', {id: id});
});

app.get('/admin/adspoint/list', function (req, res) {
    res.render('vwAdsPoint/listAdsPoint', {});
});

app.get('/admin/type/list', function (req, res) {
    res.render('vwType/listType', {});
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

app.use('/admin/report', reportRoute);
app.use('/admin/dist', wardListRoute);
app.use('/admin/request', requestRoute);

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

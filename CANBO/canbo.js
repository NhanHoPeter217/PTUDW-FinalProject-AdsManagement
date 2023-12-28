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

var whitelist = ['http://localhost:3000' /** other domains if any */];
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
//Setup handlebars view engine
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
app.set('views', './views');
app.set('view engine', '.hbs');
app.set('title', 'Ads Management');

app.get('/', (req, res) => {
    res.render('home');
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

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

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

require('dotenv').config();
require('express-async-errors');

const express = require('express');
const { engine } = require('express-handlebars');

const app = express();

const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/connect');
const sectionHandler = require('./sections.js');

// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const updateInfoRouter = require('./routes/updateInfo');
const updatepwRouter = require('./routes/updatepw');
const otpRouter = require('./routes/otp');
const forgotpwRouter = require('./routes/forgotpw');
const reportRouter = require('./routes/report');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { lang } = require('moment');

app.use(express.json());
app.use('/public', express.static('public'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/otp', otpRouter);
app.use('/api/v1/forgotpw', forgotpwRouter);
app.use('/api/v1/report', reportRouter);

// routes after login
app.use('/api/v1/jobs', jobsRouter);
app.use('/api/v1/updateInfo', updateInfoRouter);
app.use('/api/v1/updatepw', updatepwRouter);

// FRONT END
//Setup handlebars view engine
// sectionHandler(engine);

app.engine(
    'hbs',
    engine({
        extname: 'hbs',
        defaultLayout: 'nguoidan',
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

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log('Ads Management server is running at http://localhost:' + port));
    } catch (error) {
        console.log(error);
    }
};

start();

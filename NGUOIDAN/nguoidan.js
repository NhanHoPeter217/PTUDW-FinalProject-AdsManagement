require('dotenv').config({ path: '../.env' });
require('express-async-errors');

const express = require('express');
const { engine } = require('express-handlebars');

const app = express();

app.use(express.json());
app.use('/public', express.static('public'));

// FRONT END

app.engine(
    'hbs',
    engine({
        extname: 'hbs',
        defaultLayout: 'nguoidanLayout',
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
            },
            ifCond: function (v1, operator, v2, options) {
                switch (operator) {
                    case '==':
                        return v1 == v2 ? options.fn(this) : options.inverse(this);
                    case '===':
                        return v1 === v2 ? options.fn(this) : options.inverse(this);
                    case '!=':
                        return v1 != v2 ? options.fn(this) : options.inverse(this);
                    case '!==':
                        return v1 !== v2 ? options.fn(this) : options.inverse(this);
                    case '<':
                        return v1 < v2 ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return v1 <= v2 ? options.fn(this) : options.inverse(this);
                    case '>':
                        return v1 > v2 ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return v1 >= v2 ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return v1 && v2 ? options.fn(this) : options.inverse(this);
                    case '||':
                        return v1 || v2 ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            },
            inc: function (value, options) {
                return parseInt(value) + 1;
            },
        }
    })
);

// Basic setup
app.set('views', './views');
app.set('view engine', '.hbs');
app.set('title', 'Ads Management');

app.get('/', require('./home.route'));

const port = process.env.PORT_NGUOIDAN || 3000;

const start = async () => {
    try {
        app.listen(port, () =>
            console.log('Ads Management NGUOI DAN is running at http://localhost:' + port)
        );
    } catch (error) {
        console.log(error);
    }
};

start();

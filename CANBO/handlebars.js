const { engine } = require('express-handlebars');

const engineWithHelpers = engine({
    extname: 'hbs',
    defaultLayout: 'canbo',
    helpers: {
        // section Handler
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

        /**
         * If condition with different operators, accepting first value, operator and second value.
         * Accepted operators are ==, !=, ===, <, <=, >, >=, &&, ||
         * @name ifCond
         * @example
         * {{#ifCond this.data.trend "==" "u"}}
         *     <i class="material-icons">trending_up</i>
         * {{else}}
         *     <i class="material-icons">trending_down</i>
         * {{/ifCond}}
         */
        ifCond: function (v1, operator, v2, options) {
            console.log(v1, operator, v2);
            switch (operator) {
                case '==':
                    return v1 == v2 ? options.fn(this) : options.inverse(this); // eslint-disable-line
                case '!=':
                    return v1 != v2 ? options.fn(this) : options.inverse(this); // eslint-disable-line
                case '!==':
                    return v1 !== v2 ? options.fn(this) : options.inverse(this);
                case '===':
                    return v1 === v2 ? options.fn(this) : options.inverse(this);
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

        /**
         * Increase the value by 1
         * @name Inc
         * @example
         * {{inc @index}}
         */
        inc: function (value, options) {
            return parseInt(value) + 1;
        },

        create_order(val) {
            return val + 1;
        },
        format_date(dateString) {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
        
            return `${day}/${month}/${year}`;
        }
    }
});

module.exports = engineWithHelpers;

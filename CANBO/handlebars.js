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
        }
    }
});

module.exports = engineWithHelpers;
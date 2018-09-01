/**
   A generic object model    
*/
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MODEL = (function () {
    /**
        Constructs a generic MODEL
        @param {ATTRIBUTES} attributes A collection of attributes
        @param {ATTRIBUTES} data A collection of data attributes
        @param {ATTRIBUTES} description A collection of description attributes
    */

    function MODEL(attributes, data, description) {
        _classCallCheck(this, MODEL);

        this.attributes = typeof attributes === 'string' ? new ATTRIBUTES(attributes) : attributes || new ATTRIBUTES();

        this.data = data || new ATTRIBUTES();

        this.description = description || new ATTRIBUTES();
    }

    /**
        Sets a property (or a collection of properties) for this MODEL
        @param {string} key Name of property || An object containing key/value pairs
        @param {any} value Value for property
        @returns {MODEL} The object MODEL
    */

    _createClass(MODEL, [{
        key: 'set',
        value: function set(key, value) {
            if (typeof key === 'string') {
                try {
                    this[key] = value;
                    return this;
                } catch (e) {
                    console.log('Unable to set property of this MODEL.');
                    console.log(e);
                }
            } else {
                for (var prop in key) {
                    this[prop] = key[prop];
                }
            }
            return this;
        }

        /**
            Gets a property from this MODEL
            @param {string} key Name of property
            @returns {any} The value of the given key
        */
    }, {
        key: 'get',
        value: function get(key) {
            try {
                return this[key];
            } catch (e) {
                console.log('Unable to get property "' + key + '" of this MODEL.');
                console.log(e);
            }
        }
    }]);

    return MODEL;
})();


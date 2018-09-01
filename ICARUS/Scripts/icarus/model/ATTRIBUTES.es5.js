/**
   A generic set of ATTRIBUTES for an EL
*/
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ATTRIBUTES = (function (_Object) {
    _inherits(ATTRIBUTES, _Object);

    /**
        Constructs a generic Attributes data structure.
        If the 'className' argument is an object, break it out into individual attributes
        Otherwise, map to className, name, type and value (Optionally)
          @param {object} className A collection of attributes || className Element class attribute
        @param {string} name Optional Element name attribute
        @param {string} type Element type attribute
        @param {string} value Element value attribute
     */

    function ATTRIBUTES(className, name, type, value) {
        _classCallCheck(this, ATTRIBUTES);

        _get(Object.getPrototypeOf(ATTRIBUTES.prototype), 'constructor', this).call(this);
        switch (typeof className) {
            case 'string':
                this.set('class', className);
                this.set('name', name);
                this.set('type', type);
                this.set('value', value);
                break;

            case 'object':
                for (var attr in className) {
                    this.set(attr, className[attr]);
                }
                break;
        }
    }

    /**
        Gets the specified attribute
        @param {string} key Attribute key
        @returns {object} Attribute Object
     */

    _createClass(ATTRIBUTES, [{
        key: 'get',
        value: function get(key) {
            var obj = null;
            try {
                obj = this[key];
            } catch (e) {
                console.log('No attribute exists for key "' + key + '"');
            }
            return obj;
        }

        /**
            @param {string} key Attribute name
            @param {any} value Attribute value
            @returns {ATTRIBUTES} this 
         */
    }, {
        key: 'set',
        value: function set(key, value) {
            if (value !== undefined && value !== null) {
                this[key] = value || '';
            }
            return this;
        }
    }]);

    return ATTRIBUTES;
})(Object);


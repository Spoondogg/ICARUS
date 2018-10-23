/** Extends the built in String class with static formatting methods
    @see https://stackoverflow.com/questions/30257915/extend-a-string-class-in-es6
    @see http://www.loganfranken.com/blog/864/es6-everyday-extending-built-in-classes/
    @description Caution, there be wolves! 
    @see http://kangax.github.io/compat-table/es6/
    @class
    @extends String
*/
export default class STRING extends String {
	/** Returns string as camelcase
	    @static
	    @see https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
	    @returns {String} A camel case formatted string
	*/
	camelcase() {
		return this.split(' ').map(function(word, index) {
			return index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		}).join('');
	}
	/** Returns only alphanumeric values
	    @see https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
	    @returns {String} A string of only alphanumeric characters from given string
	*/
	alphanumeric() {
		return this.replace(/^[a-zA-Z0-9-_]+$/u, '').replace(/[[\]']/gu, '') || '';
	}
	/** Returns a friendly formatted string, safe for html and web components
	    @method
	    @returns {String} HTML friendly string
	*/
	friendly() {
		return this.replace(/^[a-z|A-Z|0-9|\s]*/u, '') || '';
	}
	/** Trims the given string to the specified length and applies the given ending
	    @param {number} length Length to trim string
	    @param {string} ending String to append
	    @returns {string} A string truncated to the given length
	*/
	truncate(length = 100, ending = '...') {
		return this.length > length ? this.valueOf().substring(0, length - ending.length) + ending : this.valueOf(); //.valueOf()
	}
	/** Pad with zeroes
	    @param {number} num The original number to be padded
	    @param {number} size The number of zeros to pad with
	    @returns {string} A zero padded string
	*/
	pad(num, size) {
		let s = String(num);
		while (s.length < size) {
			s = '0' + s;
		}
		return s;
	}
	/** Returns a Javascript Date object based on a given .NET JavaScriptSerializer date value
	    @see https://stackoverflow.com/a/50292370/722785
	    param {string} dateString from .NET Serializer ie: Date(1534759609990)
	    @returns {Date} Javascript Date Object
	*/
	getDateValue() {
		return new Date(parseInt(this.replace(/\D+/gu, '')));
	}
	/** Create a globally unique identifier
	    @returns {String} Globally unique identifier
	*/
	guid() {
		const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
    }
    /** Tests for a palindrome
        @param {string} input Text
        @returns {boolean} True if palindrome
    */
    isPalindrome() {
        if (this.length > 0) {
            return this.toLowerCase() === this.toLowerCase().split('').reverse().join('');
        }
        return false;
    }
}
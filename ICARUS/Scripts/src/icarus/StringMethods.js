/**
    Returns string as camelcase
    @see https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    @returns {String} A camel case formatted string
*/
String.prototype.camelcase = function() {
	return this.split(' ').map(function(word, index) {
		return index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	}).join('');
};
/**
    Returns only alphanumeric values
    @see https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    @returns {String} A string of only alphanumeric characters from given string
*/
String.prototype.alphaNumeric = function() {
	//return this.replace(/^[a-zA-Z0-9-_]+$/u, '').replace(/[\[\]']/gu, '') || '';
	return this.replace(/^[a-zA-Z0-9-_]+$/u, '').replace(/[[\]']/gu, '') || '';
};
/**
    Returns a friendly formatted string, safe for html and web components
    @method
    @returns {String} HTML friendly string
*/
String.prototype.friendly = function() {
	/*try {
			let table = {
				'<': 'lt',
				'>': 'gt',
				'"': 'quot',
				'\'': 'apos',
				'&': 'amp',
				'\r': '#10',
				'\n': '#13',
				//'?': '#63',
				':': '#58',
				';': '#59'
			};
			return this.replace(/[<>"'\r\n&]/gu, (chr) => { // Strip out characters
				return '&' + table[chr] + ';';
			}).replace(/[?=\s]+/gu, '-'); // replace spaces with dashes
	    } catch (e) {
	        throw e;
	    }*/
	return this.replace(/^[a-z|A-Z|0-9|\s]*/u, '') || '';
};
/**
    Trims the given string to the specified length and applies the given ending
    @param {number} length Length to trim string
    @param {string} ending String to append
    @returns {string} A string truncated to the given length
*/
String.prototype.truncate = function(length = 100, ending = "...") {
	if (this.length > length) {
		return this.substring(0, length - ending.length) + ending;
	}
	return this;
};
/**
    Pad with zeroes
    @param {number} num The original number to be padded
    @param {number} size The number of zeros to pad with
    @returns {string} A zero padded string
*/
String.prototype.pad = function(num, size) {
	//let s = num + '';
	let s = String(num);
	while (s.length < size) {
		s = '0' + s;
	}
	return s;
};
/**
    Returns a Javascript date object from a .NET JavaScriptSerializer date
    See https://stackoverflow.com/a/50292370/722785
    param {string} dateString from .NET Serializer ie: Date(1534759609990)
    @returns {Date} Javascript Date Object
*/
String.prototype.getDateValue = function() {
	return new Date(parseInt(this.replace(/\D+/gu, '')));
};
/**
    Create a globally unique identifier
    @returns {String} Globally unique identifier
*/
String.prototype.guid = function() {
	const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
};
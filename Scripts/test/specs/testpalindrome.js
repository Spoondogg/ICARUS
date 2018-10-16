'use strict';
var expect = require('chai').expect;
var Palindrome = require('../fixtures/palindrome');
describe('Palindrome Test Block', function() {
	it('for palindrome', function() {
		var result = Palindrome.isPalindrome('tat');
		expect(result).to.not.be.undefined;
		expect(result).to.equal(true);
	});
	it('for non palindrome', function() {
		var result = Palindrome.isPalindrome('tata');
		expect(result).to.not.be.undefined;
		expect(result).to.equal(false);
	});
	it('handling of undefined value', function() {
		var str;
		var result = Palindrome.isPalindrome(str);
		expect(result).to.not.be.undefined;
	});
});
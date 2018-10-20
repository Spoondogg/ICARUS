'use strict';
import STRING from '../../src/icarus/STRING.js';
var assert = require('assert');
//var expect = require('chai').expect;
//var Palindrome = require('../fixtures/palindrome');
//import Palindrome from '../fixtures/palindrome'

describe('Palindrome Test Block', function() {
	it('for palindrome', function() {
        var result = new STRING('tat').isPalindrome();
		expect(result).to.not.be.undefined;
		expect(result).to.equal(true);
	});
	it('for non palindrome', function() {
        var result = new STRING('tata').isPalindrome();
		expect(result).to.not.be.undefined;
		expect(result).to.equal(false);
	});
	it('handling of undefined value', function() {
		var str;
        var result = new STRING(str).isPalindrome();
		expect(result).to.not.be.undefined;
	});
});
'use strict';
/**
    Test for a palindrome
    @returns {boolean} True if a palindrome
*/
export default function Palindrome() { }
Palindrome.prototype.isPalindrome = function(input) {
	if (input) {
		return input.toLowerCase() === input.toLowerCase().split('').reverse().join('');
	}
	return false;
}
//module.exports = new Palindrome();
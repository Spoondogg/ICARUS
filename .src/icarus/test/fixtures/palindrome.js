'use strict';

function Palindrome() {}
Palindrome.prototype.isPalindrome = function(input) {
if (input) {
return input == input.split('').reverse().join('');
}
return false;
}
module.exports = new Palindrome();
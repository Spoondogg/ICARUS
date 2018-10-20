/** Test for a palindrome
    @returns {boolean} True if a palindrome
*/
export default class Palindrome {
    construct() { };
    isPalindrome(input) {
        if (input) {
            return input.toLowerCase() === input.toLowerCase().split('').reverse().join('');
        }
        return false;
    }
}
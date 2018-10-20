let chai = require('chai');
let { expect } = require('chai');
let Mocha = require('mocha');
let mocha = new Mocha({
    ui: 'bdd',
    reporter: 'list'
});
/** Various tests for the DOM */
console.log(this);
describe('DOM', () => {
    it('has the expected page title', () => {
        expect(document.title).to.equal('ICARUS Testing');
    });
    it('has the expected token metadata', () => {
        expect(document.getElementsByTagName('meta').token.content).is.not.empty;
    });
});
/** Attempt to Log in */
describe('LOGIN', () => {
    it('has the expected h1', () => {
        expect(document.getElementById('header').innerHTML).to.equal('Hello World');
    });
});
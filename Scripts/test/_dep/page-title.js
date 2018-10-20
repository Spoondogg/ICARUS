/**
    @see https://semaphoreci.com/community/tutorials/setting-up-an-end-to-end-testing-workflow-with-gulp-mocha-and-webdriverio
    @see https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha
*/
//import assert from 'assert';
describe('fixture', () => {
	it('has the expected page title', () => {
		browser.url('index.html');
		assert.equal(browser.getTitle(), 'End-to-End Testing');
	});
});
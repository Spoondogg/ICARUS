/** Test for specific page title
    @see https://semaphoreci.com/community/tutorials/setting-up-an-end-to-end-testing-workflow-with-gulp-mocha-and-webdriverio
    @see https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha
*/
    describe('document', () => {
	    it('has the expected page title', () => {
            chai.expect(document.title).to.equal('ICARUS Testing');
	    });
    });
}
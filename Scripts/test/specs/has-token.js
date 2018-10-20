/** Tests for Token
    @see https://semaphoreci.com/community/tutorials/setting-up-an-end-to-end-testing-workflow-with-gulp-mocha-and-webdriverio
    @see https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha
    @returns {describe} A mocha test
*/
export default function verifyTokenExists() {
    return describe('token', () => {
        it('has the expected token metadata', () => {
            chai.expect(document.getElementsByTagName('meta').token.content).is.not.empty;
        });
    });
}

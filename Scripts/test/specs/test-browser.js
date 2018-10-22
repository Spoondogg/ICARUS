/** Various tests for the DOM using mochaChrome
console.log(this);
describe('DOM', () => {
    it('has the expected page title', () => {
        expect(document.title).to.equal('ICARUS Testing');
    });
    it('has the expected token metadata', () => {
        expect(document.getElementsByTagName('meta').token.content).is.not.empty;
    });
});*/
/** Attempt to Log in 
describe('LOGIN', () => {
    it('has the expected h1', () => {
        expect(document.getElementById('header').innerHTML).to.equal('Hello World');
    });
});*/
describe('Browser', () => {
    it('should launch the browser', (done) => {
        browser
            .version()
            .then((v) => {
                console.log('\t - Chrome Version: ' + v);

                expect(true).to.be.true;

                done();
            })
    });
});
/*
describe('sample test', function () {
    let page;

    before(async function () {
        page = await browser.newPage();
        await page.goto('http://localhost:8052');
    });

    after(async function () {
        await page.close();
    })

    it('should have the correct page title', async function () {
        expect(await page.title()).to.eql('Puppeteer Mocha');
    });

    it('should have a heading', async function () {
        const HEADING_SELECTOR = 'h1';
        let heading;

        await page.waitFor(HEADING_SELECTOR);
        heading = await page.$eval(HEADING_SELECTOR, heading => heading.innerText);

        expect(heading).to.eql('Page Title');
    });

    it('should have a single content section', async function () {
        const BODY_SELECTOR = '.main-content';

        await page.waitFor(BODY_SELECTOR);

        expect(await page.$$(BODY_SELECTOR)).to.have.lengthOf(1);
    });
});
*/
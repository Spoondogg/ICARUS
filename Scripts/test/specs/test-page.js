let testCount = 0;
let pg;

beforeEach('Before', (done) => {
    console.log('beforeEach');
    done();
});

afterEach('After', (done) => {
    console.log('afterEach');
    done();
});

after('AfterAll', (done) => {
    console.log('AFTER ALL');
    try {
        console.log('Closing browser...');
        browser.close();
        console.log('Browser closed');
    } catch (e) {
        console.log('Browser may already be closed');
    }
    
    done();
});

before('BeforeAll', (done) => {
    console.log('BEFORE ALL');
    done();
});

/** Captures a screenshot from the browser
    @param {any} page Puppeteer browser page
    @param {any} label Screenshot label
*/
function takeScreenshot(page, label) {
    return new Promise((resolve, reject) => {
        let str = '';
        try {
            console.log('\t - Screenshot ' + testCount);
            page.screenshot({ path: './Scripts/test/screens/test-' + testCount + '-' + label + '.png' }).then((r) => {
                str = '\t - Screenshot ' + testCount;
                testCount++;
                return resolve(str);
            });
            
        } catch (e) {
            str = '\t - Failed to take screenshot ' + testCount
            return reject(str);
        }        
    });    
}

/** Performs Browser related Testing */
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

/** Performs Page related Testing */
describe('Page', () => {    
    it('should open the appropriate page (localhost)', (done) => {
        browser.newPage().then((page) => {
            takeScreenshot(page, 'page');
            page.goto('http://localhost:8052').then(() => {
                pg = page;
                console.log(takeScreenshot(pg, 'page'));
                page.title().then((title) => {
                    expect(title).to.eql('spoonMEDIA');
                    done();
                }, (reject) => {
                    console.log(' - Failed to retrieve title');
                    expect(1).to.eql(0);
                    done();
                });
            });
        });
    });

    const ELEMENT_SELECTOR = 'main';
    it('should have a "' + ELEMENT_SELECTOR + '" element with an id of "1"', (done) => {
        //takeScreenshot(pg, 'page');
        pg.$eval(ELEMENT_SELECTOR, el => el.id).then((val) => {
            console.log('id', val);
            expect(val).to.eql('1');
            done();
        });
    });

    it('should have a "' + ELEMENT_SELECTOR + '" with class "icarus-container"', (done) => {
        //takeScreenshot(pg, 'page');
        pg.$eval(ELEMENT_SELECTOR, el => el.className).then((val) => {
            console.log('class', val);
            expect(val).to.eql('icarus-container');
            done();
        });
    });
});



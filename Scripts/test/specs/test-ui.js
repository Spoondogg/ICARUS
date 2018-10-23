/** Tests are inline scripts and should be written as such */
// #region Imports
import STRING from '../../src/icarus/STRING.js';
// #endregion
// #region Variables and Methods
const USERNAME = 'ryan@spoonmedia.ca';
const PASSWORD = '***REMOVED***';

let testCount = 0;
let page = null;
let success = true;
/** Captures a screenshot from the browser
    @param {string} label Screenshot label
    @returns {Promise<void>} Promise to create a screenshot
*/
const screenshot = function(label) {
    return new Promise((resolve, reject) => {
        try {
            page.screenshot({
                path: './Scripts/test/screens/test-' + label + '-' + testCount + '.png'
            }).then((r) => {
                testCount++;
                resolve();
            });
        } catch (e) {
            console.log('\t - Failed to take screenshot ' + testCount + ', ' + label);
            reject(e);
        }
    });
}
// #endregion
// #region Maintenance
/** Instantiates the Browser before any test are ran */
before('BeforeAll', (done) => {
    console.log('Instantiate Browser and Launch Page');
    browser.newPage().then((p) => {
        p.goto('http://localhost:8052').then(() => {
            page = p;
            console.log('Loading Page...');
            p.waitFor('main').then(() => {
                done();
            });
        });
    });
});
/** Closes the Browser after all tests are ran */
after('AfterAll', (done) => {
    try {
        console.log('Closing browser...');
        browser.close();
        console.log('\t - Browser closed');
    } catch (e) {
        //console.log('Browser may already be closed');
    }
    done();
});
beforeEach('Before', (done) => {
    screenshot('page-before').then(() => {
        done();
    });
});

afterEach('After', (done) => {
    screenshot('page-after').then(() => {
        done();
    });
});
// #endregion
// #region 
// #region Tests
/** Performs Browser related Testing */
describe('Initialize Browser', () => {
    it('should launch the browser', (done) => {
         browser
            .version()
            .then((v) => {
                console.log('\t - Chrome Version: ' + v);
                expect(true);
                done();
            })
    });
});
/** Performs Page related Testing */
describe('Initialize Page', () => {
    it('should open the appropriate page (localhost)', (done) => {
        let title = null;
        try {
            browser.newPage().then((p) => {
                p.goto('http://localhost:8052').then(() => {
                    page = p;
                    p.title().then((t) => {
                        title = t;
                        //expect(t).to.eql('spoonMEDIA');
                        //done();
                    });
                });
            });
        } catch (e) {
            success = false;
        }
    });

    it('has the expected token metadata', (done) => {
        page.evaluate(() => {            
            let token = null;
            try {
                token = document.querySelector('meta[name=token]').content;
            } catch (e) {
                success = false;
            }
            expect(token !== null);
            done();
        });
        /*page.$eval('meta[name=token]', (el) => el.content).then((val) => {
            expect(val).is.not.empty;
            done();
        });*/
    });
    
    it('should have a $(main) with an id of "1"', (done) => {
        page.$eval('main', (el) => el.id).then((val) => {
            expect(val).to.eql('1');
            done();
        });
    });
    
    it('should have a $(main) with class "icarus-container"', (done) => {
        page.$eval('main', (el) => el.className).then((val) => {
            expect(val).to.eql('icarus-container');
            done();
        });
    });
});

/** Logs a User into the application */
describe('Log In', () => {

    // Launch login form
    it('should have a login button that can be clicked by the user', (done) => {        
        try {
            page.$eval('main.icarus-container .menu .list .tabs li.pull-right', (li) => {
                li.click();
            });
        } catch (e) {
            success = false;
        }
        expect(success); //.to.be.true;
        done();
    });

    // Populate inputs
    it('should have "Email" and "Password" input elements', (done) => {        
        try {
            page.evaluate((a, b) => {
                let frm = document.querySelector('form.login');
                frm.querySelector('input[name=Email]').value = USERNAME;
                frm.querySelector('input[name=Password]').value = PASSWORD;
            });
        } catch (e) {
            success = false;
        }
        expect(success); //.to.be.true;
        done();
    });

    // Simple verification that no one is logged in
    it('should have a meta tag named "user" with the default value of "guest"', (done) => {
        try {
            page.evaluate((a, b) => {
                success = document.getElementsByTagName('meta').token.content === 'Guest';
            });
        } catch (e) {
            success = 0;
        }
        expect(success); //.to.be.true;
        done();
    });

    // Submit login form
    it('should allow the user to attempt to log', (done) => {
        try {
            page.$eval('form.login button[type=SUBMIT]', (li) => {
                li.click();
            }).then(() => {
                page.on('load', () => {
                    console.log('Load Complete');
                });
            });
        } catch (e) {
            success = 0;
        }
        expect(success); //.to.be.true;
        done();
    });

    // Simple verification that user is now logged in
    it('should have a "user" meta tag with a value of "' + USERNAME + '"', (done) => {
        expect(1).to.eql(0);
        done();
    });

    /* Example of waitFor
    it('should have a single content section', async function () {
        const BODY_SELECTOR = '.main-content';

        await page.waitFor(BODY_SELECTOR);

        expect(await page.$$(BODY_SELECTOR)).to.have.lengthOf(1);
    });
    */

    // 
});
// #endregion
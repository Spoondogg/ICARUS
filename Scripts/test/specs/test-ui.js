// #region Imports
import STRING from '../../src/icarus/STRING.js';
// #endregion
// #region Variables
let testCount = 0;
let page;
// #endregion
// #region Maintenance
/** Instantiates the Browser before any test are ran */
before('BeforeAll', (done) => {
    console.log('Instantiate Browser and Launch Page');
    browser.newPage().then((p) => {
        p.goto('http://localhost:8052').then(() => {
            page = p;
            done();
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
/** Captures a screenshot from the browser
    param {any} page Puppeteer browser page
    @param {string} label Screenshot label
*/
function screenshot(label) {
    return new Promise((resolve, reject) => {
        let str;
        try {            
            page.screenshot({
                path: './Scripts/test/screens/test-' + label + '-' + testCount + '.png'
            }).then((r) => {
                testCount++;
                resolve();
            });            
        } catch (e) {
            console.log('\t - Failed to take screenshot ' + testCount + ', ' + label);
            reject();
        }        
    });    
}
// #region Tests
/** Performs Browser related Testing */
describe('Initialize Browser', () => {
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
describe('Initialize Page', () => {
    it('should open the appropriate page (localhost)', (done) => {
        browser.newPage().then((p) => {
            p.goto('http://localhost:8052').then(() => {
                page = p;
                p.title().then((title) => {
                    expect(title).to.eql('spoonMEDIA');
                    done();
                }, (reject) => {
                    console.log('\t - Failed to retrieve title');
                    expect(1).to.eql(0);
                    done();
                });
            });
        });
    });

    it('has the expected token metadata', (done) => {
        page.$eval('meta[name=token]', el => el.content).then((val) => {
            expect(val).is.not.empty;
            done();
        });
    });
    
    it('should have a $(main) with an id of "1"', (done) => {
        page.$eval('main', el => el.id).then((val) => {
            expect(val).to.eql('1');
            done();
        });
    });
    
    it('should have a $(main) with class "icarus-container"', (done) => {
        page.$eval('main', el => el.className).then((val) => {
            expect(val).to.eql('icarus-container');
            done();
        });
    });

    // Launch and populate login form
    it('should have a login button that can be clicked by the user', (done) => {
        page.$eval('main.icarus-container .menu .list .tabs li.pull-right', li => {
            li.click();
        }).then(() => {
            page.evaluate((a, b) => {
                let frm = document.querySelector('form.login');
                frm.querySelector('input[name=Email]').value = 'ryan@spoonmedia.ca';
                frm.querySelector('input[name=Password]').value = '***REMOVED***';
            }).then(() => {
                expect(1).to.eql(1);
                done();
            });
        });
    });

    // Simple verification that no one is logged in
    it('should have an empty meta tag named "user"', (done) => {

    });

    // Submit login form
    it('should allow the user to attempt to log', (done) => {
        page.$eval('form.login button[type=SUBMIT]', li => {
            li.click();
        }).then(() => {
            page.on('load', () => {
                console.log('Load Complete');
                expect(1).to.eql(1);
                done();
            });
        });
    });

    /*
    it('should have a single content section', async function () {
        const BODY_SELECTOR = '.main-content';

        await page.waitFor(BODY_SELECTOR);

        expect(await page.$$(BODY_SELECTOR)).to.have.lengthOf(1);
    });
    */

    // 
});
// #endregion
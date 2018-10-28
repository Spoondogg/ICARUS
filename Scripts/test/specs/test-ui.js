/** Tests are inline scripts and should be written as such */
/* eslint-disable no-undef */
/* eslint-disable max-lines-per-function */
// #region Imports
//import STRING from '../../src/icarus/STRING.js';
// #endregion
// #region Variables and Methods
const USERNAME = 'ryan@spoonmedia.ca';
const PASSWORD = 'wisdomCouragePower52!';
//const RECORD = false; // If true, screenshots are taken before and after each test step
let testCount = 0;
let page = null;
//let success = true;
/** Captures a screenshot from the browser
    @param {string} label Screenshot label
    @returns {Promise<void>} Promise to create a screenshot
*/
const screenshot = function(label) {
    return new Promise((resolve, reject) => {
        try {
            //if (RECORD) {
                page.screenshot({
                    path: './Scripts/test/screens/test-' + label + '-' + testCount + '.png'
                }).then(() => {
                    testCount++;
                    resolve();
                });
            //} else {
            //    resolve();
            //}
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
// #region Tests
/** Performs Browser related Testing */
describe('Initialize Browser', () => {
    it('should launch the browser', (done) => {
        try {
            browser
                .version()
                .then((v) => {
                    console.log('\t - Chrome Version: ' + v);
                    expect(true).to.equal(true);
                    done();
                });
        } catch (e) {
            expect(false).to.equal(true);
            done(e);
        }
    });
});
/** Performs Page related Testing */
describe('Initialize Page', () => {
    it('should open the appropriate page (localhost)', (done) => {  
        try {
            browser.newPage().then((p) => {
                page = p;
                p.goto('http://localhost:8052').then(() => {
                    p.title().then((t) => {
                        console.log('\t - Loaded page: ' + t);
                        expect(t).to.eql('spoonMEDIA');
                        done();
                    });
                });
            });
        } catch (e) {
            expect(false).to.equal(true);
            done(e);
        }
    });

    // Check that a token exists
    it('has the expected token metadata', (done) => {
        try {
            page.$eval('meta[name=token]', (el) => el.content).then((val) => {
                expect(val).to.not.equal(null);
                done();
            });
        } catch (e) {
            expect(false).to.equal(true);
            done(e);
        }
    });

    it('should have a $(main) with an id of "1"', (done) => {
        try {
            page.$eval('main', (el) => el.id).then((val) => {
                expect(val).to.eql('1');
                done();
            });
        } catch (e) {
            expect(false).to.equal(true);
            done(e);
        }
    });
    
    it('should have a $(main) with class "icarus-container"', (done) => {
        try {
            page.$eval('main', (el) => el.className).then((val) => {
                expect(val).to.eql('icarus-container');
                done();
            });
        } catch (e) {
            expect(false).to.equal(true);
            done(e);
        }
    });
});

/** Logs a User into the application */
describe('Log In', () => {

    // Check that no one is logged in
    it('has an empty "user" meta tag', (done) => {
        try {
            page.$eval('meta[name=user]', (el) => el.content).then((val) => {
                expect(val).to.equal('');
                done();
            });
        } catch (e) {
            expect(false).to.equal(true);
            done(e);
        }
    });
    
    // Launch login form
    it('should have a login button that can be clicked by the user', (done) => {        
        try {
            page.$eval('main.icarus-container .menu .list .tabs li.pull-right', (li) => li.click()).then(() => {
                expect(true).to.equal(true);
                done();
            });
        } catch (e) {
            expect(false).to.equal(true);
            done(e);
        }
    });
    
    // Populate inputs 
    it('should have "Email" and "Password" input elements', (done) => {        
        try {
            page.evaluate((user, pass) => {
                document.querySelector('input[name=Email]').value = user;
                document.querySelector('input[name=Password]').value = pass;                
            }, USERNAME, PASSWORD); 
            expect(true).to.equal(true);
            done();
        } catch (e) {
            expect(false).to.equal(true);
            done(e);
        }
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
            expect(true).to.equal(true);
            done();
        } catch (e) {
            expect(false).to.equal(true);
            done(e);
        }
    });

    // Simple verification that user is now logged in .
    it('should have a "user" meta tag with a value of "' + USERNAME + '"', (done) => {
        try {
            page.$eval('meta[name=user]', (el) => el.content).then((val) => {
                expect(val).to.equal(USERNAME);
                done();
            }, USERNAME);
        } catch (e) { //e
            expect(false).to.equal(true);
            done(e); //e
        }
    });
});

/** Each CONTAINER should have its own unique test case,
    but right now I'm creating a TEMPLATE for a function
*/
describe('Verify CONTAINER(s)', () => {
    it('INDEX loaded correctly', (done) => {
        try {
            page.$eval('div.index', (el) => el.className).then((val) => {
                expect(val).to.equal('icarus-container index');
                done();
            });
        } catch (e) {
            expect(false).to.equal(true);
            done(e);
        }
    });

    it('INDEXMAIN loaded correctly', (done) => {
        try {
            page.$eval('div.index-main', (el) => el.className).then((val) => {
                expect(val).to.equal('icarus-container index-main');
                done(); 
            });
        } catch (e) {
            expect(false).to.equal(true);
            done(e);
        }
    });

    it('INDEXMAIN ul.list loaded correctly', (done) => {
        try {
            page.$eval('div.index-main .container-body .pane .menu ul.list > li', (el) => el.className).on('error', (e) => {
                console.log(' - The query did not return any results');
                expect(false).to.equal(true);
                done(e);
            }).then((val) => {
                console.log('VAL: ' + val);
                expect(val).to.equal('nav-item thumbnail');
                done();
            });
        } catch (e) {
            expect(false).to.equal(true);
            done(e);
        }
    });

    it('TEST FAIL', (done) => {      
        expect(false).to.equal(true);
        done();        
    });
});
// #endregion
/* eslint-enable no-undef */
/* eslint-enable max-lines-per-function */
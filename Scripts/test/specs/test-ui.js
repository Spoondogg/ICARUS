/** Tests are inline scripts and should be written as such */
/* eslint-disable no-undef */
/* eslint-disable max-lines-per-function */
// #region Imports
//import STRING from '../../src/icarus/STRING.js';
// #endregion
// #region Variables and Methods
const USERNAME = 'ryan@spoonmedia.ca';
const PASSWORD = 'wisdomCouragePower52!';

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
            page.screenshot({
                path: './Scripts/test/screens/test-' + label + '-' + testCount + '.png'
            }).then(() => {
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
            });
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
            done(e);
        }
    });
    
    // Launch login form
    it('should have a login button that can be clicked by the user', (done) => {        
        try {
            page.$eval('main.icarus-container .menu .list .tabs li.pull-right', (li) => li.click()).then(() => {
                expect(true);
                done();
            });
        } catch (e) {
            done(e);
        }
    });
    
    // Populate inputs 
    it('should have "Email" and "Password" input elements', (done) => {        
        try {
            page.$eval('form.login', (form) => frm).then((formElements) => {
                console.log('Len: ' + formElements.length);
                formElements.Email.value = USERNAME;
                formElements.Password.value = PASSWORD;

                //let frm = document.querySelector('form.login');
                //frm.querySelector('input[name=Email]').value = USERNAME;
                //frm.querySelector('input[name=Password]').value = PASSWORD;
                expect(true);
                done();
            });
        } catch (e) {
            done(e);
        }
    });

    /**********************
    // Simple verification that no one is logged in
    it('should have a meta tag named "user" with the default value of "guest"', (done) => {
        try {
            page.evaluate(() => {
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
    **********************/
});
// #endregion
/* eslint-enable no-undef */
/* eslint-enable max-lines-per-function */
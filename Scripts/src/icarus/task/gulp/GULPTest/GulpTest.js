import GULPFILE, { GULPPATHS, del } from '../GULPFILE.js';
import connect from 'connect';
import http from 'http';
import servestatic from 'serve-static';
/** GulpFile that performs Testing, builds fixtures etc
    @class
    @extends GULPFILE
*/
export default class GulpTest extends GULPFILE {
	/*constructor() { //global
	    super();
	    //const { expect } = require('chai');
	    ///const _ = require('lodash');
	    //const globalVariables = _.pick(global, ['browser', 'expect']);
	    ///const globalVariables = _.pick(global, ['browser']);
	}*/
	/** Deletes contents of 'test' folders on the DEV Server (PROD BUILD)
	    @param {Function} done Callback
	    @returns {void}
	*/
	cleanTest(done) {
		del([GULPPATHS.server.dev + 'Scripts/test/', GULPPATHS.server.dev + 'Content/styles/test/']);
		done();
	}
	/** Creates a static server at localhost:9001 to host tests
	    @returns {Promise<resolve>} Promise 
	*/
	server_test() {
		return new Promise((resolve) => {
			let server = connect().use(servestatic('Scripts/test/fixtures'));
			http.createServer(server).listen(9001);
			resolve(server);
		});
	}
	/** Performs UI and API Testing
	    @param {global} global NodeJS Global
	    @returns {gulp.series} Series
	*/
	test(global) {
		//const _ = require('lodash');
		//const globalVariables = _.pick(global, ['browser']);
		return this.gulp.series(
			(done) => this.test_ui(done, global),
			(done) => this.test_api(done));
	}
	/** API Related testing fixtures
	    @param {Function} done Callback
	    @returns {Promise<done>} Callback
	*/
	test_api(done) {
		console.log(' - Testing API');
		let server = this.server_test();
		done(server);
	}
	/** UI and Behavior testing using Puppeteer and Mocha
	    @param {Function} done Callback function
	    @param {global} global NodeJS Global
	    @see https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
	    @returns {Promise} Promise to launch Mocha and Puppeteer
	*/
	test_ui(done, global) {
		try {
			const Puppeteer = require('puppeteer');
			const Mocha = require('mocha');
			//const fs = require('fs');
			//const path = require('path'); 
			const { expect } = require('chai');
			const _ = require('lodash');
			const globalVariables = _.pick(global, ['browser', 'expect']);
			// Clear out old screenshots
			del(['../../Scripts/test/screens/**/*']);
			// puppeteer options
			const opts = {
				ui: 'bdd',
				bail: true,
				reporter: 'spec',
				headless: true,
				//slowMo: 100,
				timeout: 60000 // One minute to pass all tests
			};
			// expose variables - The browser should be available to all tests that need it
			global.expect = expect;
			global.browser = Puppeteer.launch(opts).then((browser) => { // brwsr
				//browser = brwsr;
				global.browser = browser; // verify
				let m = new Mocha(opts);
				m.addFile('../../Scripts/test/specs/test-ui.js').run()
					.on('error', (e) => this.logError(' - MOCHA Tests failed', e, done))
					.on('end', () => {
						console.log(' - MOCHA Test completed');
						global.expect = globalVariables.expect;
						global.browser = globalVariables.browser;
						this.logCompletion(' - MOCHA End Complete', done);
					});
			});
		} catch (e) {
			this.logError('TEST UI FAILED', e, done);
		}
	}
}
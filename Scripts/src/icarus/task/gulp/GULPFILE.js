/** @module */
import {
	GULPPATHS
} from './GULPPATHS.js';
import autoprefixer from 'autoprefixer';
import beautify from 'gulp-jsbeautifier';
import buffer from 'gulp-buffer';
import cleancss from 'gulp-clean-css';
import concat from 'gulp-concat';
import connect from 'connect';
import del from 'del';
//import doxygen from 'doxygen';
import eslint from 'gulp-eslint';
import gutil from 'gulp-util';
import http from 'http';
import jsdoc from 'gulp-jsdoc3';
import merge from 'merge2';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import postcssfontsmoothing from 'postcss-font-smoothing';
import postcssmomentumscrolling from 'postcss-momentum-scrolling';
import postcsstouchcallout from 'postcss-touch-callout';
import rename from 'gulp-rename';
import request from 'request';
import sass from 'gulp-sass';
import sassdoc from 'sassdoc';
import sasslint from 'gulp-sass-lint';
import servestatic from 'serve-static';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
/** Performs various Gulp Tasks
    @class
*/
export default class GULPFILE {
	/** Construct a GULPFILE to assist with Gulp Tasks
	    @param {gulp} gulp A Gulp (Node.js)
	*/
	constructor(gulp) {
		console.log('GULPFILE');
		this.gulp = gulp;
	}
	/** Error handling prevents gulp watch from stopping
	    @param {any} err An error
	    @returns {void}
	    @see https://scotch.io/tutorials/prevent-errors-from-crashing-gulp-watch#toc-prevent-errors-from-breaking-tasks
	    @see https://stackoverflow.com/questions/43474288/gulp-4-keep-watching-even-on-error
	    @see https://cameronspear.com/blog/how-to-handle-gulp-watch-errors-with-plumber/
	*/
	onError(err) {
		notify.onError({
			title: "Gulp error in " + err.plugin,
			message: err.toString()
		})(err);
		gutil.beep();
	}
	/** Parse SASS into CSS, append prefixes and minify (with sourcemap)
	    @param {Function} done Callback
	    @param {string} src Styles source path
	    @param {string} dest Styles destination path
	    @param {string} basename Stylesheet filename
	    @returns {Promise} Gulp promise
	    @see https://github.com/postcss/gulp-postcss
	    @see https://github.com/postcss/autoprefixer#options
	    @see https://scotch.io/tutorials/prevent-errors-from-crashing-gulp-watch#toc-prevent-errors-from-breaking-tasks
	*/
	buildStyles(done, src = GULPPATHS.styles.src, dest = GULPPATHS.styles.dest, basename = 'icarus') {
		return this.pipeEvents('BuildStyles',
			() => this.gulp.src(src)
			.pipe(sourcemaps.init())
			.pipe(sass()).on('error', (e) => this.logError(' - Failed to transcode Sass', e, done)).on('success', () => console.log(' - Successdully transcoded Sass'))
			.pipe(rename({
				basename,
				suffix: '.min'
			}))
			.pipe(postcss([
				autoprefixer({
					browsers: ['last 2 versions'],
					cascade: false
				}),
				postcsstouchcallout,
				postcssmomentumscrolling,
				postcssfontsmoothing
			]))
			.pipe(cleancss({ /*compatibility: 'ie8'*/ }))
			.pipe(sourcemaps.write('.')) //'.'
			.pipe(this.gulp.dest(dest)), done);
	}
	/** Creates CSS Dependencies from external
	    param {Function} done Callback
	    @param {string} dest Styles destination path
	    @param {string} filename Vendor file name
	    @returns {Promise} Gulp promise
	*/
	buildVendorStylesPipe(dest = GULPPATHS.styles.dest, filename = 'vendor') {
		merge(request('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css').pipe(source('bootstrap.css')), request('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css').pipe(source('animate.css'))).pipe(plumber({
			errorHandler: this.onError
		})).pipe(buffer()).pipe(concat(filename + '.css')).pipe(this.gulp.dest(dest));
	}
	/** Creates CSS Dependencies from external
	    @param {Function} done Callback
	    @param {string} dest Styles destination path
	    @param {string} filename Vendor file name
	    @returns {Promise} Gulp promise
	*/
	buildVendorStyles(done, dest = GULPPATHS.styles.dest, filename = 'vendor') {
		this.pipeEvents('BuildVendorStyles', () => this.buildVendorStylesPipe(dest, filename), done);
	}
	/** Retrieves font dependencies from external (CDN) and saves locally (src,dist)
	    @param {Function} done Callback
	    @returns {void} 
	    @see https://cdnjs.com/libraries/twitter-bootstrap/3.3.7
	*/
	buildVendorFonts(done) {
		['eot', 'svg', 'ttf', 'woff', 'woff2'].forEach((filetype) => {
			['src', 'dist'].forEach((dir) => {
				request('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.' + filetype).pipe(source('glyphicons-halflings-regular.' + filetype)).pipe(this.gulp.dest('Content/styles/' + dir + '/fonts'));
			});
		});
		done();
	}
	/** Beautify the given Sass Stylesheet
	    @param {any} done callback
	    @param {string} src Stylesheet Path
	    @returns {gulp.pipe} Gulp Pipe
	*/
	beautifyStyles(done, src = GULPPATHS.styles.src) {
		return this.pipeEvents('BeautifyStyles', () => this.beautifyStylesPipe(src), done);
	}
	/** Beautifies Sass Document
	    @param {Function} done Callback
	    @param {string} src Styles source path
	    @returns {gulp} A gulp object
	*/
	beautifyStylesPipe(done, src = GULPPATHS.styles.src) {
		return this.gulp.src(src, {
			base: './'
		}).pipe(beautify(require(GULPPATHS.config.beautify))).pipe(this.gulp.dest('./'));
	}
	/** Terses Scripts and creates appropriate Sourcemaps
	    @param {Function} done Callback
	    @param {string} src Scripts source path
	    @param {string} dest Scripts destination path
	    @returns {Promise} Gulp promise
	*/
	buildScripts(done, src = GULPPATHS.scripts.src, dest = GULPPATHS.scripts.dest) {
		return this.pipeEvents('BuildScripts',
			() => this.gulp.src(src, {
				base: GULPPATHS.scripts.base
			}).pipe(plumber({
				errorHandler: this.onError
			})).pipe(sourcemaps.init()).on('error', (e) => this.logError(' - Failed to initialize Script Sourcemaps', e, done)).on('end', () => this.logCompletion(' - Successfully initialized Script Sourcemaps')).pipe(terser()).on('error', (e) => this.logError(' - Failed to terse Scripts', e, done)).on('end', () => this.logCompletion(' - Successfully tersed Scripts')).pipe(sourcemaps.write('.')).on('error', (e) => this.logError(' - Failed to create sourcemaps for Scripts', e, done)).on('end', () => this.logCompletion(' - Successfully created sourcemaps for Scripts')).pipe(this.gulp.dest(dest)), done);
	}
	/** Builds Vendor Scripts, Styles and Fonts
	    @returns {gulp.series} Series
	*/
	buildVendorAll() {
		return this.gulp.series(
			(done) => this.logCompletion('GULPFILE.buildVendorAll().start()', done),
			(done) => this.buildVendorScripts(done),
			(done) => this.buildVendorStyles(done),
			(done) => this.buildVendorFonts(done),
			(done) => this.logCompletion('GULPFILE.buildVendorAll().end()', done));
	}
	/** Logs message to console and then performs callback
	    @param {string} msg Console message
	    @param {Function} callback Done callback
	    @returns {void}
	*/
	logCompletion(msg, callback = () => null) {
		console.log(msg);
		callback();
	}
	/** Logs message and error to console and then performs callback
	    @param {string} msg Console message
	    @param {Error} e Error
	    @param {any} callback Done callback
	    @returns {void}
	*/
	logError(msg, e, callback = () => false) {
		console.log(msg, e);
		callback();
	}
	/** Creates Javascript Dependencies inside Scripts/dist 
	    @param {Function} done Callback
	    @param {string} dest Destination Path
	    @param {string} filename Output name
	    @returns {Promise} Gulp promise
	*/
	buildVendorScripts(done, dest = GULPPATHS.scripts.dest, filename = 'vendor') {
		return this.pipeEvents('BuildVendorScripts',
			() => merge(
				request('https://code.jquery.com/jquery-3.3.1.min.js').pipe(source('jquery.js')),
				request('http://code.jquery.com/ui/1.12.1/jquery-ui.min.js').pipe(source('jqueryUI.js')),
				request('https://cdn.jsdelivr.net/npm/jquery-validation@1.17.0/dist/jquery.validate.min.js').pipe(source('jqueryValidate.js')),
				request('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js').pipe(source('bootstrap.js')))
			.pipe(plumber({
				errorHandler: this.onError
			}))
			.pipe(buffer())
			.pipe(concat(filename + '.js'))
			.pipe(this.gulp.dest(dest)), done);
	}
	/** ES6 Beautification Pipe beautifies Script Files
	    @param {Function} done Callback
	    @param {string} path Scripts Path
	    @returns {Promise} Gulp promise
	*/
	beautifyScripts(done, path = GULPPATHS.scripts.src) {
		return this.pipeEvents('BeautifyScripts', () => this.gulp.src(path, {
			base: './'
		}).pipe(beautify(require(GULPPATHS.config.beautify))).pipe(this.gulp.dest('./')), done);
	}
	/** Creates a Pipe for linting ES6
	    @param {string} src Source Path
	    @returns {gulp.series} A gulp 
	*/
	lintScriptsPipe(src) {
		return this.gulp.src(src)
			.pipe(plumber({ errorHandler: this.onError }))
			.pipe(eslint(require(GULPPATHS.config.eslint)))
			.pipe(eslint.format());
	}
	/** Lints given Script Files with ESLint
	    @param {any} done callback
	    @param {string} label Script Label
	    @param {string} src Glob path
	    @returns {gulp.pipe} Gulp Pipe
	*/
	lintScripts(done, label, src) {
		return this.pipeEvents(label, () => this.lintScriptsPipe(src), done);
	}
	/** Appends Generic Error, Success and End Events for the given Pipe and passes done method where applicable
	     @param {string} label Pipe Label
	     @param {gulp.pipe} pipe Gulp Pipe
	     @param {Function} done callback
	     @returns {gulp.pipe} Gulp Pipe with Events
	*/
	pipeEvents(label, pipe, done) {
		return pipe()
			.on('error', (e) => this.logError(' - ' + label + ': Error', e, done))
			.on('success', () => console.log(' - ' + label + ': Success'))
			.on('end', () => this.logCompletion(' - ' + label + ': End', done));
	}
	/** Performs linting on Sass Stylesheet
	    @param {string} src Path to Styles
	    @returns {gulp} A gulp object
	    @see https://github.com/sasstools/sass-lint/tree/master/docs/rules
	    @see https://github.com/sasstools/gulp-sass-lint/blob/master/tests/.sass-lint.yml
	    @see https://github.com/sasstools/gulp-sass-lint#optionsrules
	*/
	lintStylesPipe(src = GULPPATHS.styles.basefile) {
		return this.gulp.src(src)
			.pipe(sasslint(require(GULPPATHS.config.sasslint)))
			.pipe(sasslint.format())
			.pipe(sasslint.failOnError());
	}
	/** Performs linting of Stylesheets
	     @param {any} done callback
	     @param {string} src Stylesheet Path
	     @returns {gulp.pipe} Gulp Pipe
	*/
	lintStyles(done, src = GULPPATHS.styles.basefile) {
		return this.pipeEvents('LintStyles', () => this.lintStylesPipe(src), done);
	}
	/** Generates Style documentation using Sassdoc
	    @param {Function} done Callback
	    @returns {Promise} Gulp promise
	*/
	documentStyles(done) {
		return this.pipeEvents('DocumentStyles',
			() => this.gulp.src(GULPPATHS.styles.src).pipe(sassdoc(require('../config/sassdoc.json'))), done);
	}
	/** Generates Script documentation using JSDoc3
	    @param {Function} done Callback
        @param {string} src Scripts Source Path
	    @returns {Promise} Gulp promise
	*/
	documentScripts(done, src = GULPPATHS.scripts.src) {
		return this.pipeEvents('DocumentScripts',
			() => this.gulp.src(src, {
				read: false
			}).pipe(jsdoc(require('../config/jsdoc.json'))), done); // MUST be string
	}
	/** Generate C# Documentation using Doxygen
	    @see https://stackoverflow.com/questions/36897877/gulp-error-the-following-tasks-did-not-complete-did-you-forget-to-signal-async
        @param {doxygen} doxygen Doxygen Node Module
        param {Function} done Callback
	    @returns {Promise} Async promise
	*/
	documentAPI(doxygen) {
		let config = {
			"PROJECT_NAME": "Icarus",
			"PROJECT_NUMBER": "0.6.0",
			"PROJECT_BRIEF": "SinglePage Web Application",
			"PROJECT_LOGO": "Content/icon50.png",
			"OUTPUT_DIRECTORY": "Documentation/doxygen",
			"INPUT": "./",
			"RECURSIVE": "YES",
			"FILE_PATTERNS": ["*.cs", "*.cshtml"],
			"EXTENSION_MAPPING": "cs=C#",
			"GENERATE_LATEX": "NO",
			"EXCLUDE_PATTERNS": ["*/node_modules/*"],
			"MARKDOWN_SUPPORT": "YES",
			"USE_MDFILE_AS_MAINPAGE": "README.md"
		};
		return new Promise((resolve, reject) => {
			try {
				console.log('Promise documentAPI');
				doxygen.downloadVersion();
				console.log('Promise documentAPI: Then');
				doxygen.createConfig(config, 'doxygen.config');
				console.log('Promise documentAPI: Run');
				doxygen.run('doxygen.config');
				resolve();
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});
		/*return new Promise((resolve, reject) => {
		    try {
		        doxygen.downloadVersion().then(() => {
		            doxygen.createConfig('../config/doxygen.json'); // config, 
		            doxygen.run('../config/doxygen.json');
		        });
		        resolve();
		    } catch (e) {
		        console.warn('Promise Reject: Doxygen', e);
		        reject(e);
		    }
		});*/
	}
	/** Creates a static local server to host Documentation
        @param {number} port Server Port
	    @returns {Promise} Promise to create a server
	*/
	serveDocumentation(port = 9000) {
		return new Promise((resolve) => {
			console.log('GULPFILE.serveDocumentation(' + port + ')');
			let server = connect().use(servestatic('Documentation'));
			http.createServer(server).listen(port);
			resolve(server);
		});
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
			const {
				expect
			} = require('chai');
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
	/** Deletes contents of dist folders 
	    @param {Function} done Callback
	    @returns {void}
	*/
	emptyDist(done) {
		del(['Scripts/dist/', 'Content/styles/dist/']);
		done();
	}
	/** Pipe that Copies contents of source to destination
	    @param {string} src Source Path
	    @param {string} dest Destination Path
	    @returns {gulp} A gulp promise
	*/
	publishPipe(src, dest) {
		return this.gulp.src(src).pipe(this.gulp.dest(dest));
	}
	/** Copies contents of source to destination
	    @param {Function} done Callback
	    @param {string} label Label
	    @param {string} src Source Path
	    @param {string} dest Destination Path
	    @returns {gulp} A gulp promise
	*/
	publish(done, label, src, dest) {
		return this.pipeEvents('Publish: ' + label, () => this.publishPipe(src, dest), done);
	}
	/** Publishes Scripts and Styles to the dev server 
	    @param {Function} done Callback
	    @returns {gulp} A gulp series
	*/
	publishToDev() {
		return this.gulp.series(
			(done) => this.logCompletion(' - Publishing to DEV...', done), this.buildVendorAll,
			(done) => this.publish(done, 'Scripts', ['Scripts/**/**.*', '!**/deprec/**/**.*', '!**/test/**/**.*', '!**.(yml|md)'], GULPPATHS.server.dev + 'Scripts'),
			(done) => this.publish(done, 'Styles', [GULPPATHS.styles.baseglob, '!**.(yml|md)'], GULPPATHS.server.dev + 'Content/styles'),
			(done) => this.logCompletion('- Publishing to DEV Complete', done));
	}
	/** Publishes Scripts and Styles to the dev server 
	    @param {Function} done Callback
	    @returns {gulp} A gulp series
	*/
	publishToProd() {
		return this.gulp.series(
			(done) => this.logCompletion('\n\n\n==== publish to PROD BEGIN ====', done),
			(done) => {
				console.log('\n > Clearing out old data');
				del(['I://iis/icarus/**/*'], { force: true });
				done();
			},
			(done) => {
				this.gulp.src(['I://iis/dev/**/*', '!**.(yml|md)']).pipe(this.gulp.dest(GULPPATHS.server.prod));
				done();
			},
			(done) => this.logCompletion('\n\n\n==== publish to PROD END ====', done));
	}
	/** Beautifies Scripts and Styles 
	    @returns {gulp.series} Series
	*/
	beautifyAll() {
		return this.gulp.series(
			(done) => this.beautifyScripts(done),
			(done) => this.beautifyStyles(done));
	}
	/** Lints Scripts and Styles 
	    @returns {gulp.series} Series 
	*/
	lintAll() {
		return this.gulp.series(
			(done) => this.lintScripts(done, 'Scripts', GULPPATHS.scripts.src),
			(done) => this.lintStyles(done),
			(done) => this.lintScripts(done, 'Tasks', GULPPATHS.tasks.src));
	}
	/** Lints Scripts and Styles 
	    @returns {gulp.series} Series 
	*/
	documentClient() {
		return this.gulp.series(
			(done) => this.documentStyles(done),
			(done) => this.documentScripts(done)
		);
	}
	/** Generates JSDoc, SassDoc and API Documentation
        @param {doxygen} doxygen Doxygen Node Module
	    @returns {gulp.series} Series
	*/
	buildDocumentation(doxygen) {
		return this.gulp.series(
			(done) => this.documentScripts(done),
			(done) => this.documentStyles(done),
			() => this.documentAPI(doxygen)
			//this.serveDocumentation
		);
	}
	/** Performs UI and API Testing
	    @param {global} global NodeJS Global
	    @returns {gulp.series} Series
	*/
	test(global) {
		return this.gulp.series(
			(done) => this.test_ui(done, global),
			(done) => this.test_api(done));
	}
	/** Builds Source and Vendor Scripts
	    @returns {gulp.series} Series
	*/
	buildAllScripts() {
		return this.gulp.series(
			(done) => this.buildScripts(done),
			(done) => this.buildVendorScripts(done));
	}
	/** Beautifies 'src' Styles and Scripts, then performs linting.
	    If lint returns no errors, the target environment is cleaned and 'dist' is built
	    @returns {gulp.series} Series
	*/
	build() {
		return this.gulp.series(
			(done) => this.logCompletion('GULPFILE.build().start()', done),
			(done) => this.beautifyAll()(done),
			(done) => this.lintAll()(done),
			(done) => this.emptyDist(done),
			(done) => this.lintStyles(done),
            (done) => this.buildStyles(done),
			(done) => this.buildAllScripts()(done),
			(done) => this.logCompletion('GULPFILE.build().end()', done));
	}
	/** Lint, Build on Success, then Publish
        @param {string} dest Destination 
	    @returns {gulp.series} Series
	*/
	scripts_lintbuildpublish(dest = GULPPATHS.server.dev + 'Scripts') {
		return this.gulp.series(
			(done) => this.logCompletion(' ==> GULPFILE.scripts_lintbuildpublish().start()', done),
			(done) => this.lintScripts(done, 'Scripts', GULPPATHS.scripts.src),
			(done) => this.buildScripts(done),
			//(done) => this.publishScripts(done),
			(done) => this.publish(done, 'Scripts', ['Scripts/**/**.*', '!**/deprec/**/**.*', '!**/test/**/**.*', '!**.(yml|md)'], dest),
			(done) => this.logCompletion(' ==> GULPFILE.scripts_lintbuildpublish().end()', done));
	}
	/** Lint, Build on Success, then publish 
	    @returns {gulp.series} Series
	*/
	styles_lintbuildpublish() {
		return this.gulp.series(
			(done) => this.logCompletion('GULPFILE.styles_lintbuildpublish().start()', done),
			(done) => this.lintStyles(done),
			(done) => this.buildStyles(done),
			(done) => this.publish(done, 'Styles', [GULPPATHS.styles.baseglob, '!**.(yml|md)'], GULPPATHS.server.dev + 'Content/styles'),
			//(done) => this.publishStyles(done),
			(done) => this.logCompletion('GULPFILE.styles_lintbuildpublish().end()', done));
	}
	/** Watches the given path and performs the provided series on edit
	    @param {string} path Glob path
	    @param {gulp.series} series Gulp Series
	    @param {string} label Task Label
	    @returns {void}
	*/
	watchPath(path, series, label) {
		console.log('this.gulp.watch(' + label + ')', path);
		this.pipeEvents('Gulp.WatchPath', () => this.gulp.watch(path, series), null);
	}
	/** Optimize images
	@see https://www.npmjs.com/package/gulp4#incremental-builds
	@returns {Promise} Gulp promise
	optimizeImages() {
	    return gulp.src(paths.images.src, { since: gulp.lastRun(images) })
	        .pipe(imagemin({ optimizationLevel: 5 }))
	        .pipe(gulp.dest(paths.images.dest));
	}*/
	/** Performs watch tasks within a container that can be reset
	    @param {gulp} gulp A Gulp to be slurped
	    @see https://codepen.io/ScavaJripter/post/how-to-watch-the-same-gulpfile-js-with-gulp
	    @returns {void}
	*/
	slurp() {
		console.log('GULPFILE.slurp()');
		try {
			if (this.gulp.slurped) {
				console.log('GULPFILE: Already Slurped?');
			} else {
				this.watchPath(GULPPATHS.scripts.baseglob, this.scripts_lintbuildpublish(), 'Scripts');
				this.watchPath(GULPPATHS.styles.basefile, this.styles_lintbuildpublish(), 'Styles');
				this.watchPath(GULPPATHS.tasks.src, () => this.lintScripts(() => null, 'GulpTasks', GULPPATHS.tasks.src), 'Tasks');
				this.watchPath(GULPPATHS.tests.baseglob, () => this.lintScripts(() => null, 'MochaTests', GULPPATHS.tests.src), 'Tests');
				this.gulp.slurped = true;
				console.log('GULPFILE: Slurped');
			}
		} catch (e) {
			this.logError('GULPFILE: Choked.  Slurp failed.', e);
		}
	}
	/** Looping watch that reloads when gulpfile is changed  
	    @returns {void}
	*/
	watch() {
		console.log('GULPFILE.watch()');
		this.slurp(this.gulp);
	}
}
export {
	GULPPATHS
}
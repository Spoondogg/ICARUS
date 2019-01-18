/* eslint-disable max-lines */
/* eslint-disable no-undef */
/** An ES6 Gulpfile for Gulp4
    @module
    @see https://www.npmjs.com/package/gulp4#real-version-400-alpha2 
    @see https://github.com/wprig/wprig/wiki/Updating-to-Gulp-4
    @see https://www.liquidlight.co.uk/blog/article/how-do-i-update-to-gulp-4/
    @see https://codeburst.io/switching-to-gulp-4-0-271ae63530c0
    @see https://fettblog.eu/gulp-4-sourcemaps/
    @see https://coderwall.com/p/9uzttg/simple-gulp-copy-file-task
*/
import { GULPPATHS } from './GULPPATHS.js';
import autoprefixer from 'autoprefixer';
//import babel from 'gulp-babel';
import beautify from 'gulp-jsbeautifier';
import buffer from 'gulp-buffer';
//import chai from 'chai';
//import chaiAsPromised from 'chai-as-promised';
//import chromedriver from 'chromedriver';
import cleancss from 'gulp-clean-css';
import concat from 'gulp-concat';
import connect from 'connect';
import del from 'del';
import doxygen from 'doxygen';
import eslint from 'gulp-eslint';
//import fs from 'file-system';
//import gulp from 'gulp4';
import gutil from 'gulp-util';
import http from 'http';
import jsdoc from 'gulp-jsdoc3';
//import Launcher from 'webdriverio/build/lib/launcher';
import merge from 'merge2';
//import mocha from 'gulp-mocha';
//import mochaChrome from 'gulp-mocha-chrome';
import notify from 'gulp-notify';
//import path from 'path';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
//import postcssclean from 'postcss-clean'; // gulp-clean-css
import postcssfontsmoothing from 'postcss-font-smoothing';
import postcssmomentumscrolling from 'postcss-momentum-scrolling';
import postcsstouchcallout from 'postcss-touch-callout';
//import puppeteer from 'puppeteer';
//import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import request from 'request';
import sass from 'gulp-sass';
import sassdoc from 'sassdoc';
import sasslint from 'gulp-sass-lint';
import servestatic from 'serve-static';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
//import webdriver from 'selenium-webdriver';
/** An attempt to organize tasks into something a little easier to use, 
    the GULPFILE acts as a Controller for Gulp tasks
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
        this.gulp.src(src)
            .pipe(sourcemaps.init())
            .pipe(sass())
                .on('error', (e) => this.logError(' - Failed to transcode Sass', e, done))
                .on('success', () => console.log(' - Successdully transcoded Sass'))
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
            .pipe(this.gulp.dest(dest))
                .on('error', (e) => this.logError('GULPFILE.buildStyles() Error', e, done))
                .on('end', () => this.logCompletion('GULPFILE.buildStyles() End', done));
    }
    /** Creates CSS Dependencies from external
        @param {Function} done Callback
        @param {string} dest Styles destination path
        @param {string} filename Vendor file name
        @returns {Promise} Gulp promise
    */
    buildVendorStyles(done, dest = GULPPATHS.styles.dest, filename = 'vendor') {
        merge(
            request('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css')
                .pipe(source('bootstrap.css')),

            request('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css')
                .pipe(source('animate.css'))
        )
        .pipe(plumber({ errorHandler: this.onError }))
        .pipe(buffer())
        .pipe(concat(filename + '.css'))
        .pipe(this.gulp.dest(dest))
            .on('error', (e) => console.log(' - Failed to build vendor styles', e, done))
            .on('success', () => console.log('- Vendor styles have been successfully built'))
            .on('end', () => this.logCompletion('GULPFILE.styles_build_vendor().end()', done));
    }
    /** Retrieves font dependencies from external (CDN) and saves locally (src,dist)
        @param {Function} done Callback
        @returns {void} 
        @see https://cdnjs.com/libraries/twitter-bootstrap/3.3.7
    */
    buildVendorFonts(done) {
        ['eot', 'svg', 'ttf', 'woff', 'woff2'].forEach((filetype) => {
            ['src', 'dist'].forEach((dir) => {
                request(
                    'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.' + filetype
                )
                .pipe(source('glyphicons-halflings-regular.' + filetype))
                .pipe(this.gulp.dest('Content/styles/' + dir + '/fonts'));
            });
        });
        done();
    }
    /** Beautifies Sass Document
        @param {Function} done Callback
        @param {string} src Styles source path
        @returns {gulp} A gulp object
    */
    beautifyStyles(done, src = GULPPATHS.styles.src) {
        return this.gulp.src(src, { base: './' })
            .pipe(beautify(require(GULPPATHS.config.beautify)))
            .pipe(this.gulp.dest('./'))
                .on('error', (e) => this.logError(' - Failed to Beautify Styles', e, done))
                .on('end', () => this.logCompletion('GULPFILE.beautifyStyles() End', done));
    }
    /** Terses Scripts and creates appropriate Sourcemaps
        @param {Function} done Callback
        @param {string} src Scripts source path
        @param {string} dest Scripts destination path
        @returns {Promise} Gulp promise
    */
    buildScripts(done, src = GULPPATHS.scripts.src, dest = GULPPATHS.scripts.dest) {
        return this.gulp.src(src, { base: GULPPATHS.scripts.base })
            .pipe(plumber({ errorHandler: this.onError }))
            .pipe(sourcemaps.init())
                .on('error', (e) => this.logError(' - Failed to initialize Script Sourcemaps', e, done))
                .on('end', () => this.logCompletion(' - Successfully initialized Script Sourcemaps'))
            .pipe(terser())
                .on('error', (e) => this.logError(' - Failed to terse Scripts', e, done))
                .on('end', () => this.logCompletion(' - Successfully tersed Scripts'))
            .pipe(sourcemaps.write('.'))
                .on('error', (e) => this.logError(' - Failed to create sourcemaps for Scripts', e, done))
                .on('end', () => this.logCompletion(' - Successfully created sourcemaps for Scripts'))
            .pipe(this.gulp.dest(dest))
                .on('error', (e) => this.logError(' - Failed to copy Scripts', e, done))
                //.on('success', () => console.log(' - Successfully copied Scripts', done()))
                .on('end', () => this.logCompletion('GULPFILE.buildScripts() End', done));
    }
    /** Logs message to console and then performs callback
        @param {string} msg Console message
        @param {Function} callback Done callback
        @returns {void}
    */
    logCompletion(msg, callback = () => true) {
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
        return merge(
            request('https://code.jquery.com/jquery-3.3.1.min.js').pipe(source('jquery.js')),
            request('http://code.jquery.com/ui/1.12.1/jquery-ui.min.js').pipe(source('jqueryUI.js')),
            request('https://cdn.jsdelivr.net/npm/jquery-validation@1.17.0/dist/jquery.validate.min.js').pipe(source('jqueryValidate.js')),
            request('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js').pipe(source('bootstrap.js'))
        )
        .pipe(plumber({ errorHandler: this.onError }))
        .pipe(buffer())
        .pipe(concat(filename + '.js'))
        .pipe(this.gulp.dest(dest))
            .on('error', (e) => this.logError(' - Failed to publish vendor Scripts', e, done))
            .on('success', () => console.log(' - Vendor scripts have been successfully published'))
            .on('end', () => this.logCompletion('GULPFILE.buildVendorScripts().end()', done));
    }
    /** ES6 Beautification
        @param {Function} done Callback
        @param {string} path Scripts Path
        @returns {Promise} Gulp promise
    */
    beautifyScripts(done, path = GULPPATHS.scripts.src) {
        return this.gulp.src(path, { base: './' })
            .pipe(beautify(require(GULPPATHS.config.beautify)))
            .pipe(this.gulp.dest('./'))
                .on('error', (e) => this.logError(' - Failed to beautify Scripts', e, done))
                .on('success', () => console.log(' - Scripts have been successfully beautify'))
                .on('end', () => this.logCompletion('GULPFILE.beautifyScripts().end()', done));
    }
    /** Performs linting on Gulpfile 
        @param {any} done callback
        @param {string} label Label
        @param {string} src Source Path
        @returns {gulp.series} A gulp 
    */
    lintScripts(done, label, src) {
        return this.gulp.src(src)
            .pipe(plumber({ errorHandler: this.onError }))
            .pipe(eslint(require(GULPPATHS.config.eslint)))
            .pipe(eslint.format())
                .on('error', (e) => this.logError(' - Failed to lint ' + label, e, done))
                .on('end', () => this.logCompletion(' - ' + label + ' linting Complete', done));
    }
    /** Performs linting on Gulpfile 
        param {gulp} gulp Gulp
        @param {any} done callback
        @returns {gulp} A gulp 
    */
    lintTasks(done) {
        return this.gulp.src(GULPPATHS.tasks.src)
            .pipe(plumber({ errorHandler: this.onError }))
            .pipe(eslint(require(GULPPATHS.config.eslint)))
            .pipe(eslint.format())
                .on('error', (e) => this.logError(' - Failed to lint Tasks', e, done))
                .on('end', () => this.logCompletion(' - Task linting complete', done));
    }
    /** Performs linting on Gulpfile 
        param {gulp} gulp Gulp
        @param {any} done callback
        @returns {gulp} A gulp 
    */
    lintTests(done) {
        return this.gulp.src(GULPPATHS.tests.src)
            .pipe(plumber({ errorHandler: this.onError }))
            .pipe(eslint(require(GULPPATHS.config.eslint)))
            .pipe(eslint.format())
                .on('error', (e) => this.logError(' - Failed to lint Tasks', e, done))
                .on('end', () => this.logCompletion(' - Task linting complete', done));
    }
    /** Performs linting on Sass Stylesheet
        @param {Function} done Callback
        @returns {gulp} A gulp object
        @see https://github.com/sasstools/sass-lint/tree/master/docs/rules
        @see https://github.com/sasstools/gulp-sass-lint/blob/master/tests/.sass-lint.yml
        @see https://github.com/sasstools/gulp-sass-lint#optionsrules
    */
    lintStyles(done) {
        return this.gulp.src(GULPPATHS.styles.basefile) // './Content/styles/src/icarus/icarus.scss'
            .pipe(sasslint(require(GULPPATHS.config.sasslint)))
            .pipe(sasslint.format())
            .pipe(sasslint.failOnError())
                .on('error', (e) => this.logError(' - Failed to lint Sass', e, done))
                .on('end', () => this.logCompletion('GULPFILE.lintStyles() End', done));
    }
    /** Generates Style documentation using Sassdoc
        @param {Function} done Callback
        @returns {Promise} Gulp promise
    */
    documentStyles(done) {
        return this.gulp.src(GULPPATHS.styles.src)
            .pipe(sassdoc({
                dest: 'Documentation/sassdoc',
                verbose: true,
                display: {
                    access: ['public', 'private'],
                    alias: true,
                    watermark: true
                },
                groups: {
                    'undefined': 'Ungrouped',
                    foo: 'Foo group',
                    bar: 'Bar group'
                },
                basePath: 'https://github.com/Spoondogg/ICARUS/blob/master/ICARUS/Content/css/icarus/scss/'
            }))
                .on('end', () => this.logCompletion('GULPFILE.document_styles() End', done));
    }
    /** Generates Script documentation using JSDoc3
        @param {Function} done Callback
        @returns {Promise} Gulp promise
    */
    documentScripts(done) {
        return this.gulp.src(GULPPATHS.styles.src, { read: false })
            .pipe(jsdoc(require('./config/jsdoc.json')))
            .on('end', () => this.logCompletion('GULPFILE.document_scripts() End', done));
    }
    /** Generate C# Documentation using Doxygen
        @see https://stackoverflow.com/questions/36897877/gulp-error-the-following-tasks-did-not-complete-did-you-forget-to-signal-async
        @returns {Promise} Async promise
    */
    documentAPI() {
        return Promise.resolve(doxygen.downloadVersion().then(() => {
            doxygen.createConfig(GULPPATHS.config.doxygen); // config, 
            doxygen.run(GULPPATHS.config.doxygen);
        }));
        /*return new Promise((resolve) => {
            doxygen.downloadVersion().then(() => {
                doxygen.createConfig(GULPPATHS.config.doxygen); // config, 
                doxygen.run(GULPPATHS.config.doxygen);
            });
            resolve();
        })*/
    }
    /** Creates a static server at localhost:9000 to host Documentation
        @returns {Promise} Promise to create a server
    */
    serveDocumentation() {
        return new Promise((resolve) => {
            let server = connect().use(servestatic('Documentation'));
            http.createServer(server).listen(9000);
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
        @see https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
        @returns {Promise} Promise to launch Mocha and Puppeteer
    */
    test_ui(done) {
        try {
            const Puppeteer = require('puppeteer');
            const Mocha = require('mocha');
            //const fs = require('fs');
            //const path = require('path'); 
            const { expect } = require('chai');
            const _ = require('lodash');
            const globalVariables = _.pick(global, ['browser', 'expect']);

            // Clear out old screenshots
            del(['Scripts/test/screens/**/*']);

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
            global.browser = Puppeteer.launch(opts).then((brwsr) => {
                browser = brwsr;
                let m = new Mocha(opts);
                m.addFile('./Scripts/test/specs/test-ui.js').run().on('error', () => {
                    console.log(' - MOCHA Tests failed');
                    //onError(e);
                    done();
                }).on('end', () => {
                    console.log(' - MOCHA Test completed');
                    global.expect = globalVariables.expect;
                    global.browser = globalVariables.browser;
                    console.log('MOCHA End Complete');
                    done();
                });
            });
        } catch (e) {
            console.log('TEST UI FAILED', e);
            done();
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
    /** Copies contents of source to destination
        @param {Function} done Callback
        @param {string} label Label
        @param {string} src Source Path
        @param {string} dest Destination Path
        @returns {gulp} A gulp promise
    */
    publish(done, label, src, dest) {
        return this.gulp.src(src)
            .pipe(this.gulp.dest(dest))
                .on('error', (e) => this.logError(' - Failed to publish ' + label, e, done))
                .on('success', () => console.log(' - Successfully published ' + label))
                .on('end', () => this.logCompletion('GULPFILE.publish(' + label + ') End', done));
    }
    /** Publishes Scripts and Styles to the dev server 
        @param {Function} done Callback
        @returns {gulp} A gulp series
    */
    publishToDev() {
        return this.gulp.series(
            (done) => this.logCompletion('\n\n\n==== publish to DEV BEGIN ====', done),
            (done) => this.buildVendorScripts(done),
            (done) => this.buildVendorStyles(done),
            (done) => this.buildVendorFonts(done),
            (done) => this.publish(done, 'Scripts', ['Scripts/**/**.*', '!**/deprec/**/**.*', '!**/test/**/**.*', '!**.(yml|md)'], GULPPATHS.server.dev + 'Scripts'),
            (done) => this.publish(done, 'Styles', [GULPPATHS.styles.baseglob, '!**.(yml|md)'], GULPPATHS.server.dev + 'Content/styles'),
            (done) => this.logCompletion('\n\n\n==== publish to DEV END ====', done)
        );
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
                this.gulp.src(['I://iis/dev/**/*', '!**.(yml|md)'])
                    .pipe(this.gulp.dest(GULPPATHS.server.prod));
                done();
            },
            (done) => this.logCompletion('\n\n\n==== publish to PROD END ====', done)
        );
    }
    /** Beautifies Scripts and Styles 
        @returns {gulp.series} Series
    */
    beautifyAll() {
        return this.gulp.series(
            (done) => this.logCompletion('\n\n\n==== beautification BEGIN ====', done),
            (done) => this.beautifyScripts(done),
            (done) => this.beautifyStyles(done),
            (done) => this.logCompletion('\n\n\n==== beautification END ====', done)
        );
    }
    /** Lints Scripts and Styles 
        @returns {gulp.series} Series 
    */
    lintAll() {
        return this.gulp.series(
            (done) => this.logCompletion('\n\n\n==== lintification BEGIN ====', done),
            (done) => this.lintScripts(done, 'Scripts', GULPPATHS.scripts.src),
            (done) => this.lintStyles(done),
            (done) => this.lintScripts(done, 'Tasks', GULPPATHS.tasks.src),
            (done) => this.logCompletion('\n\n\n==== lintification END ====', done)
        );
    }
    /** Generates JSDoc, SassDoc and API Documentation
        @returns {gulp.series} Series
    */
    buildDocumentation() {
        return this.gulp.series(
            (done) => this.logCompletion('\n\n\n==== documentation BEGIN ====', done),
            (done) => this.documentScripts(done),
            (done) => this.documentStyles(done),
            this.documentAPI,
            this.serveDocumentation,
            (done) => this.logCompletion('\n\n\n==== documentation END ====', done)
        );
    }
    /** Lints Styles
        @returns {gulp.series} Series
    
    stylification() {
        return this.gulp.series(
            (done) => this.logCompletion('\n\n\n==== stylification BEGIN ====', done),
            this.lintStyles(),
            (done) => this.logCompletion('\n\n\n==== stylification END ====', done)
        );
    }*/
    /** Performs UI and API Testing
        @param {Function} done Callback
        @returns {gulp.series} Series
    */
    test() {
        return this.gulp.series(
            (done) => this.logCompletion('\n\n\n==== test BEGIN ====', done),
            //test_ui,
            //test_api,
            (done) => this.logCompletion('\n\n\n==== test END ====', done)
        );
            //.on('end', () => console.log('End Test'))
            //.on('error', (e) => console.log('Unable to Test', e))
            //.on('success', () => console.log('GULPFILE.test() success'));
    }
    /** Builds Source and Vendor Scripts
        @returns {gulp.series} Series
    */
    buildAllScripts() {
        return this.gulp.series(
            (done) => this.logCompletion('GULPFILE.scriptification().start()', done),
            (done) => this.buildScripts(done),
            (done) => this.buildVendorScripts(done),
            (done) => this.logCompletion('GULPFILE.scriptification().end()', done)
        );
    }
    /** Beautifies 'src' Styles and Scripts, then performs linting.
        If lint returns no errors, the target environment is cleaned
        and 'dist' is built
        @returns {gulp.series} Series
    */
    build() {
        return this.gulp.series(
            (done) => this.logCompletion('GULPFILE.build().start()', done),
            this.beautifyAll(),
            this.lintAll(),
            (done) => this.emptyDist(done),
            (done) => this.lintStyles(done),
            //this.stylification(),
            this.buildAllScripts(),
            (done) => this.logCompletion('GULPFILE.build().end()', done)
        );
    }
    /** Lint, Build on Success, then publish 
        param {gulp} gulp Gulp
        param {any} done Callback
        @returns {gulp.series} Series
    */
    scripts_lintbuildpublish() {
        return this.gulp.series(
            (done) => this.logCompletion(' ==> GULPFILE.scripts_lintbuildpublish().start()', done),
            //(done) => this.lintScripts(done),
            (done) => this.lintScripts(done, 'Scripts', GULPPATHS.scripts.src),
            (done) => this.buildScripts(done),
            //(done) => this.publishScripts(done),
            (done) => this.publish(done, 'Scripts', ['Scripts/**/**.*', '!**/deprec/**/**.*', '!**/test/**/**.*', '!**.(yml|md)'], GULPPATHS.server.dev + 'Scripts'),
            (done) => this.logCompletion(' ==> GULPFILE.scripts_lintbuildpublish().end()', done)
        );
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
            (done) => this.logCompletion('GULPFILE.styles_lintbuildpublish().end()', done)
        );
    }
    /** Watches the given path and performs the provided series on edit
        @param {string} path Glob path
        @param {gulp.series} series Gulp Series
        @param {string} label Task Label
        @returns {void}
    */
    watchPath(path, series, label) {
        console.log('this.gulp.watch(' + label + ')', path);
        this.gulp.watch(path, series)
            .on('error', (e) => this.logError('Unable to perform task: ' + label, e))
            .on('end', () => this.logCompletion('GULPFILE.slurp()[' + label + '] ended'));
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
                this.watchPath(GULPPATHS.tests.baseglob, () => this.lintTasks(() => null), 'Tasks');
                this.watchPath(GULPPATHS.tests.baseglob, () => this.lintTests(() => null), 'Tests');
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
export { GULPPATHS }
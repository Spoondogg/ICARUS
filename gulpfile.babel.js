/// <binding />
// #region Imports
/** @module */
import autoprefixer from 'autoprefixer';
import babel from 'gulp-babel';
import beautify from 'gulp-jsbeautifier';
import buffer from 'gulp-buffer';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chromedriver from 'chromedriver';
import cleancss from 'gulp-clean-css';
import concat from 'gulp-concat';
import connect from 'connect';
import del from 'del';
import doxygen from 'doxygen';
import eslint from 'gulp-eslint';
import gulp from 'gulp4';
import gutil from 'gulp-util';
import http from 'http';
import jsdoc from 'gulp-jsdoc3';
import Launcher from 'webdriverio/build/lib/launcher';
import merge from 'merge2';
import mocha from 'gulp-mocha';
import mochaChrome from 'gulp-mocha-chrome';
import notify from 'gulp-notify';
import path from 'path';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import postcssclean from 'postcss-clean'; // gulp-clean-css
import postcssfontsmoothing from 'postcss-font-smoothing';
import postcsstouchcallout from 'postcss-touch-callout';
import postcssmomentumscrolling from 'postcss-momentum-scrolling';
import puppeteer from 'puppeteer';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import request from 'request';
import sass from 'gulp-sass';
import sassdoc from 'sassdoc';
import sasslint from 'gulp-sass-lint';
import servestatic from 'serve-static';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
import webdriver from 'selenium-webdriver';
// #endregion
// #region Config
/** An ES6 Gulpfile for Gulp4
    @see https://www.npmjs.com/package/gulp4#real-version-400-alpha2 
    @see https://github.com/wprig/wprig/wiki/Updating-to-Gulp-4
    @see https://www.liquidlight.co.uk/blog/article/how-do-i-update-to-gulp-4/
    @see https://codeburst.io/switching-to-gulp-4-0-271ae63530c0
    @see https://fettblog.eu/gulp-4-sourcemaps/
    @see https://coderwall.com/p/9uzttg/simple-gulp-copy-file-task
*/
/** Relevent build paths */
const paths = {
    styles: {
        baseglob: 'Content/styles/**/**.*',
        base: 'Content/styles/src/icarus',
        basefile: './Content/styles/src/icarus/icarus.scss',
        dest: 'Content/styles/dist/icarus',
        src: 'Content/styles/src/icarus/**/*.scss'        
    },
    scripts: {
        buildglob: 'Scripts/**/**.*',
        base: 'Scripts/src/icarus',
        baseglob: './Scripts/src/**/**.js',
        src: 'Scripts/src/icarus/**/*.js',
        dest: 'Scripts/dist/icarus'
    },
    serverside: {
        cs: ['Controllers/**/**.cs', 'Models/Icarus/**/**.cs'],
        cshtml: 'Views/**/**.cshtml'
    },
    images: {
        src: 'Content/Images/**/*.{jpg,jpeg,png}',
        dest: 'build/img/'
    },
    tests: {
        src: 'Scripts/test/specs/**/*.js'
    },
    server: {
        dev: 'I://iis/dev/',
        prod: 'I://iis/icarus/'
    },
    config: {        
        beautify: './config/beautify.json',        
        doxygen: './config/doxygen.json',
        eslint: './config/eslint.json',
        sasslint: './config/sasslint.json'
    }
};
// #endregion
// #region ServerSide
export function $server_beautify() {
    let config = require(paths.config.beautify);
    return gulp.src(paths.serverside.cs)
        .pipe(beautify(config))
        .pipe(gulp.dest('./'));
}
// #endregion
// #region Styles
/** Parse SASS into CSS, append prefixes and minify (with sourcemap)
    @see https://github.com/postcss/gulp-postcss
    @see https://github.com/postcss/autoprefixer#options
    @see https://scotch.io/tutorials/prevent-errors-from-crashing-gulp-watch#toc-prevent-errors-from-breaking-tasks
*/
export function styles_build_src(done) {
    console.log(' - Building Styles: ' + paths.styles.src);
    let plugins = [
        autoprefixer({ browsers: ['last 2 versions'], cascade: false }),
        postcsstouchcallout,
        postcssmomentumscrolling,
        postcssfontsmoothing
    ];
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', (e) => {
            console.log(' - Failed to transcode Sass', e);
            done();
        }).on('end', () => {
            console.log(' - ' +paths.styles.src + ' has been transcoded');
            done();
        })
        .pipe(rename({
            basename: 'icarus',
            suffix: '.min',
        }))
        .pipe(postcss(plugins))
        .pipe(cleancss({ /*compatibility: 'ie8'*/ }))
        .pipe(sourcemaps.write('.')) //'.'
        .pipe(gulp.dest(paths.styles.dest));
}
/** Creates CSS Dependencies from external
*/
export function styles_build_vendor() {
    let bootstrap = request('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css')
        .pipe(source('bootstrap.css'));
    let animate = request('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css')
        .pipe(source('animate.css'));
    return merge(bootstrap, animate)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(buffer())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(paths.styles.dest));
}
/** Retrieves font dependencies from external (CDN) and saves locally (src,dist)
    @see https://cdnjs.com/libraries/twitter-bootstrap/3.3.7
*/
export function fonts_build_vendor(done) {
    let dirs = ['src', 'dist'];
    let filetypes = ['eot', 'svg', 'ttf', 'woff', 'woff2'];
    filetypes.forEach((type) => {
        let file = request(
            'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.' + type
        );
        dirs.forEach((dir) => {
            file.pipe(source('glyphicons-halflings-regular.' + type))
                .pipe(gulp.dest('Content/styles/' + dir + '/fonts'));
        });
    });
    done();
}
/** Beautifies Sass Document
    @returns {gulp} A gulp object
*/
export function styles_beautify_src() {
    let config = require(paths.config.beautify);
    return gulp.src(paths.styles.src, { base: './' })
        .pipe(beautify(config))
        .pipe(gulp.dest('./'));
}
/** Performs linting on Sass Stylesheet
    @see https://github.com/sasstools/sass-lint/tree/master/docs/rules
    @see https://github.com/sasstools/gulp-sass-lint/blob/master/tests/.sass-lint.yml
    @see https://github.com/sasstools/gulp-sass-lint#optionsrules
    @returns {gulp} A gulp object
*/
export function styles_lint_src(done) {
    console.log(' - Linting Styles: ' + paths.styles.basefile);
    let config = require(paths.config.sasslint);
    return gulp.src(paths.styles.basefile) // './Content/styles/src/icarus/icarus.scss'
        .pipe(sasslint(config))
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError()).on('error', (e) => {
            console.log(' - Failed to lint Sass');
            done();
        }).on('end', () => {
            console.log(' - ' + paths.styles.basefile + ' has been linted');
            done();
        });
}
// #endregion
// #region Scripts
/** Error handling prevents gulp watch from stopping
    @see https://scotch.io/tutorials/prevent-errors-from-crashing-gulp-watch#toc-prevent-errors-from-breaking-tasks
    @see https://stackoverflow.com/questions/43474288/gulp-4-keep-watching-even-on-error
    @see https://cameronspear.com/blog/how-to-handle-gulp-watch-errors-with-plumber/
    @param {any} err An error
 */
function onError(err) {
    notify.onError({
        title: "Gulp error in " + err.plugin,
        message: err.toString()
    })(err);
    gutil.beep();
};
/** Terses Scripts and creates appropriate Sourcemaps
    @param {any} done Callback
 */
export function scripts_build_src(done) {
    console.log(' - Building Scripts: ' + paths.scripts.src);
    return gulp.src(paths.scripts.src, { base: paths.scripts.base })
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(terser()).on('error', (e) => {
            console.log(' - Failed to terse Scripts');
            done();
        }).on('success', () => {
            console.log(paths.scripts.src + ' has been successfully tersed');
        }).on('end', () => {
            done();
        })
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest));
}
/** Creates Javascript Dependencies inside Scripts/dist */
export function scripts_build_vendor(done) {

    let jquery = request('https://code.jquery.com/jquery-3.3.1.min.js').pipe(source('jquery.js'));
    let jqueryUI = request('http://code.jquery.com/ui/1.12.1/jquery-ui.min.js').pipe(source('jqueryUI.js'));
    let jqueryValidate = request('https://cdn.jsdelivr.net/npm/jquery-validation@1.17.0/dist/jquery.validate.min.js').pipe(source('jqueryValidate.js'));
    //let modernizr = request('https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js').pipe(source('modernizr.js'));
    let bootstrap = request('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js').pipe(source('bootstrap.js'));
    return merge(jquery, jqueryUI, jqueryValidate, /*modernizr,*/ bootstrap)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(buffer())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.scripts.dest)).on('error', (e) => {
            console.log(' - Failed to publish vendor Scripts');
            done();
        }).on('success', () => {
            console.log('Vendor scripts have been successfully published');
        }).on('end', () => {
            done();
        })
}
/**
    ES6 Beautification
*/
export function scripts_beautify_src() {
    let config = require(paths.config.beautify);
    return gulp.src(paths.scripts.src, { base: './' })
        .pipe(beautify(config))
        .pipe(gulp.dest('./'));
}
/** Lint the Scripts 'src' files
*/
export function scripts_lint_src(done) {
    console.log(' - Linting Scripts: ' + paths.scripts.src);
    let config = require(paths.config.eslint);
    return gulp.src(paths.scripts.src)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(eslint(config))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError()).on('error', (e) => {
            console.log(' - Failed to lint Javascript');
            done();
        }).on('end', () => {
            done();
        });
}
// #endregion
// #region Images
/** @see https://www.npmjs.com/package/gulp4#incremental-builds */
function images() {
    return gulp.src(paths.images.src, { since: gulp.lastRun(images) })
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest(paths.images.dest));
}
// #endregion
// #region Documentation
/**
    Generates Style documentation using Sassdoc
*/
export function document_styles() {
    return gulp.src(paths.styles.src)
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
        }
        ));
}
/**
    Generates Script documentation using JSDoc3
*/
export function document_scripts() {
    var cfg = require('./config/jsdoc.json');
    return gulp.src(paths.styles.src, { read: false })
        .pipe(jsdoc(cfg));
}
/**
    Generate C# Documentation using Doxygen
    @see https://stackoverflow.com/questions/36897877/gulp-error-the-following-tasks-did-not-complete-did-you-forget-to-signal-async
    @returns {Promise} Async promise
*/
export function document_api() {
    return new Promise((resolve, reject) => {
        doxygen.downloadVersion().then(() => {
            doxygen.createConfig(config, paths.config.doxygen);
            doxygen.run(paths.config.doxygen);
        });
        resolve();
    });
}
/**
    Creates a static server at localhost:9000 to host Documentation
*/
export function _server_document() {
    return new Promise((resolve, reject) => {
        let docs = connect().use(servestatic('Documentation'));
        http.createServer(docs).listen(9000);
        resolve();
    });
}
// #endregion
// #region Tests 

export function _test_mochaChrome(done) {

    //const stream = mochaPhantomJS();
    //stream.write({ path: 'http://localhost:8000/index.html' });
    //stream.end();
    //return stream;

    // @see https://github.com/shellscape/gulp-mocha-chrome
    return gulp.src(['./Scripts/test/fixtures/index2.html'])
        .pipe(plumber({ errorHandler: onError }))
        .pipe(mochaChrome({ reporter: 'spec' })).on('error', (e) => {
            console.log(' - Failed to test');
            done();
        }).on('success', () => {
            console.log(' - ' + paths.scripts.src + ' has been successfully tested');
        }).on('end', () => {
            done();
        });;
}

export function _test_puppeteer2(done) {
    const puppeteer = require('puppeteer');
    const Mocha = require('mocha');    
    const { expect } = require('chai');
    const _ = require('lodash');
    const globalVariables = _.pick(global, ['browser', 'expect']);
    
    // puppeteer options
    const opts = {
        headless: false,
        //slowMo: 100,
        timeout: 10000
    };

    // expose variables
    let before = (done) => {
        global.expect = expect;
        global.browser = puppeteer.launch(opts).then(
            (brwsr) => {
                browser = brwsr;
                done();
            }
        );
    };

    // close browser and reset global variables
    let after = () => {
        browser.close();
        global.browser = globalVariables.browser;
        global.expect = globalVariables.expect;
    };

    // This works.
    before(() => {

        let mocha = new Mocha({
            ui: 'bdd',
            reporter: 'spec'
        });
        mocha.addFile('./Scripts/test/fixtures/tests.js');
        
        console.log('Running Mocha');
        mocha.run().on('end', () => {
            console.log('Running after()');
            after();
            done();
        });
    });
    
    // Instantiate a Mocha instance.




    /*
    return new Promise((resolve, reject) => {
        let browser = puppeteer.launch({ headless: false });
        resolve();
    });
    */


}

/** Performs Mocha/Chai Testing via Headless Chrome (Puppeteer)
    @param {any} done Callback function
*/
export function _test_puppeteer(done) {
    let chai = require('chai');
    let expect = chai.expect
    let Mocha = require('mocha');
    let path = require('path');

    let browser = null;
    let page = null;
    // Instantiate a Mocha instance.
    
    
    puppeteer.launch({ headless: false, timeout: 10000 }).then((brwsr) => {
        browser = brwsr;
        browser.newPage().then((pg) => {
            page = pg;
            page.setViewport({
                width: 767, height: 800
            });
            pg.goto('http://localhost:8052').then(() => {                    

                console.log(' - Loaded index.html');

                /*
                mocha.describe('DOM', () => {
                    it('has the expected page title', () => {
                        expect(document.title).to.equal('ICARUS Testing');
                    });
                    it('has the expected token metadata', () => {
                        expect(document.getElementsByTagName('meta').token.content).is.not.empty;
                    });
                });
                */
                let mocha = new Mocha({
                    ui: 'bdd',
                    reporter: 'spec'
                });
                mocha.addFile('./Scripts/test/fixtures/tests.js');

                mocha.run();
                    

                //const title = 

                /*const text = page.evaluate(() => {
                    browser.getTitle()
                });*/

                    
                brwsr.close();

                done();
            });
        });
    });

    
    /*
    return new Promise((resolve, reject) => {
        let browser = puppeteer.launch({ headless: false });
        resolve();
    });
    */

}

export function _test_mochaphantomjs(done) {
    const stream = mochaChrome();
    stream.write({ path: 'http://localhost:8052/index.html' });
    stream.end();
    return stream;
}

export function _test(done) {
    /*
    console.log('========= TEST =========');

    //const stream = mochaChrome();
    //stream.write({ path: 'http://localhost:9001/index.html' });
    //stream.end();
    //return stream; 

    //const { expect } = chai;
    //puppeteer.launch();
    //newPage().goto('http://localhost:9001');
    puppeteer.launch().then((browser) => {
        const page = browser.newPage();
        page.goto('http://localhost:9001/index.html');

        console.log(' - Loaded index.html');
        describe('fixture', () => {
            it('has the expected page title', () => {
                //browser.url('http://localhost:9001/index.html');
                //chai.expect(document.title).to.equal('End-to-End Testing');

                const text = page.evaluate(() => {
                    document.title
                })
                chai.expect(text).to.equal('End-to-End Testing')
            })
        });

        browser.close();
    });

    */

    /*
    return gulp.src('')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(mochaChrome({ reporter: 'spec', })).on('error', (e) => {
            console.log(' - Failed to test');
            done();
        }).on('success', () => {
            console.log(' - ' + paths.scripts.src + ' has been successfully tested');
        }).on('end', () => {
            done();
        });
        */
    /*return gulp.src(paths.tests.src, { read: false })
        .pipe(plumber({ errorHandler: onError }))
        .pipe(mocha({ reporter: 'spec' })).on('error', (e) => {
            console.log(' - Failed to test');
            done();
        }).on('success', () => {
            console.log(' - ' + paths.scripts.src + ' has been successfully tested');
        }).on('end', () => {
            done();
        });*/


    //let httpServer;
    //const app = connect().use(servestatic('Scripts/test/fixtures'));
    //let httpServer = http.createServer(app).listen(9001, done);

    //const { expect } = require('chai');
    //const puppeteer = require('puppeteer');

    //puppeteer.launch().newPage().goto('http://localhost:9001');



    //let browser = puppeteer.launch();
    //let page = browser.newPage();
    //page.goto('http://localhost:9001');

    // Closing the page
    //await page.close();

    /*
    describe('fixture', (done) => {
        before(async function () {
            browser = await puppeteer.launch();
            page = await browser.newPage();
        });

        it('has the expected page title', () => {
            browser.url('index.html');
            assert.equal(browser.getTitle(), 'End-to-End Testing');
        });
    });
    */

    /*
    // @see https://codeburst.io/end-to-end-testing-with-headless-chrome-api-d564cb4150c3
    describe('First tests with puppeteer:', function () {
        // Define global variables
        let browser;
        let page;

        before(async function () {
            browser = await puppeteer.launch();
            page = await browser.newPage();
        })

        beforeEach(async function () {
            page = await browser.newPage();
            await page.goto('http://localhost:9000')
        })

        afterEach(async function () {
            await page.close();
        })

        after(async function () {
            await browser.close();
        })
    });
    */
}
/** Creates a static server at localhost:9001 to host tests
    @returns {Promise<resolve>} Promise 
*/
export function _server_test() {
    return new Promise((resolve, reject) => {
        let tests = connect().use(servestatic('Scripts/test/fixtures'));
        http.createServer(tests).listen(9001);
        resolve();
    });
}
// #endregion
// #region Publish
/** Deletes contents of dist folders */
const _clean = () => del([
    'Scripts/dist/', 'Content/styles/dist/'
]);
/**
    Publishes 'src' and 'dist' Script folders
    @param {boolean} dev If true, push 'src' along with 'dist'
    @todo dev pushes 'src' and 'dist', while prod only has 'dist'
*/
export function scripts_publish(dev = true) {
    console.log(' - Publishing Scripts: ' + paths.scripts.buildglob); // 'Scripts/**/**.*'
    return gulp.src(['Scripts/**/**.*', '!**/deprec/**/**.*', '!**/test/**/**.*', '!**.(yml|md)'])
        .pipe(gulp.dest(paths.server.dev + 'Scripts'));
}
/** Publishes 'src' and 'dist' Style folders
    @param {boolean} dev If true, push 'src' along with 'dist'
    @todo dev pushes 'src' and 'dist', while prod only has 'dist'
*/
export function styles_publish() {
    console.log(' - Publishing Styles: ' + paths.styles.baseglob);
    return gulp.src([paths.styles.baseglob, '!**.(yml|md)'])
        .pipe(gulp.dest(paths.server.dev + 'Content/styles'));
}
/** Publishes Scripts and Styles to the dev server */
export function _publish() {
    return gulp.series(
        scripts_build_vendor,
        styles_build_vendor,
        //fonts_build_vendor,
        scripts_publish,
        styles_publish
    );
}
// #endregion
// #region Watch
/**
    Watches Scripts and Styles and builds on change
    @see https://gist.github.com/jeromecoupe/0b807b0c1050647eb340360902c3203a
*/
export function _watch() {
    _watch_scripts();
    _watch_styles();
}
/**
    Watches Styles for changes and performs linting
*/
export function _watch_styles() {
    gulp.watch(paths.styles.basefile, styles_lintbuildpublish); // styles_lint_src
}
/**
    Watches Styles for changes and performs linting
*/
export function _watch_scripts() {
    gulp.watch(paths.scripts.baseglob, scripts_lintbuildpublish); //scripts_lintbuildpublish, scripts_lint_src
}
// #endregion
// #region Maintenance
/** Beautifies Scripts and Styles */
const _beautify = gulp.series(
    scripts_beautify_src,
    styles_beautify_src
);
/** Lints Scripts and Styles */
const _lint = gulp.series(
    scripts_lint_src,
    styles_lint_src
);
/** Beautifies 'src' Styles and Scripts, then performs linting.
    If lint returns no errors, the target environment is cleaned
    and 'dist' is built
 */
const _build = gulp.series(
    _beautify,
    _lint,
    _clean,
    styles_build_src,
    styles_build_vendor,
    fonts_build_vendor,
    scripts_build_src,
    scripts_build_vendor
);

/** Lint, Build on Success, then publish */
const scripts_lintbuildpublish = gulp.series(
    (done) => {
        console.log('\n\n\n==== scripts_lintbuildpublish BEGIN ====');
        done();
    },
    //scripts_beautify_src,
    scripts_lint_src,
    scripts_build_src,
    scripts_publish,
    (done) => {
        console.log('\n\n\n==== scripts_lintbuildpublish END ====');
        done();
    },
);
/** 
    Lint, Build on Success, then publish
 */
const styles_lintbuildpublish = gulp.series(
    (done) => {
        console.log('\n\n\n==== styles_lintbuildpublish BEGIN ====');
        done();
    },
    styles_lint_src,
    styles_build_src,
    styles_publish,
    (done) => {
        console.log('\n\n\n==== styles_lintbuildpublish END ====');
        done();
    },
);
/**
    Compiles documentation for Scripts, Styles and API
*/
const _document = gulp.series(
    (done) => {
        console.log('\n\n\n==== _document ====');
        done();
    },
    document_scripts,
    document_styles,
    document_api
);
// #endregion
// #region Exports
export { _beautify, _build, _clean, _lint, scripts_lintbuildpublish, styles_lintbuildpublish };
export default _build;
// #endregion
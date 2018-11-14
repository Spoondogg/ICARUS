/* eslint-disable max-lines */
/* eslint-disable no-undef */
// #region Head
// #region Imports
/** @module */
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
import gulp from 'gulp4';
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
// #endregion Imports
// #region Variables
/** Error handling prevents gulp watch from stopping
    @param {any} err An error
    @returns {void}
    @see https://scotch.io/tutorials/prevent-errors-from-crashing-gulp-watch#toc-prevent-errors-from-breaking-tasks
    @see https://stackoverflow.com/questions/43474288/gulp-4-keep-watching-even-on-error
    @see https://cameronspear.com/blog/how-to-handle-gulp-watch-errors-with-plumber/
 */
const onError = (err) => {
    notify.onError({
        title: "Gulp error in " + err.plugin,
        message: err.toString()
    })(err);
    gutil.beep();
}
// #endregion Variables
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
        src: ['Scripts/src/icarus/**/*.js'],
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
        src: 'Scripts/test/specs/**/*.js',
        //buildglob: 'Scripts/test/**/**.*',
        base: 'Scripts/test',
        baseglob: 'Scripts/test/specs/**/*.js'
    },
    tasks: {
        src: 'gulpfile.babel.js'
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
/** Indicates if the file has been slurped
    @see https://codepen.io/ScavaJripter/post/how-to-watch-the-same-gulpfile-js-with-gulp
*/
gulp.slurped = false;
// #endregion Config
// #endregion Head
// #region ServerSide
/** Performs beautification on server side source code
    @param {any} done Callback
    @returns {Promise} Gulp promise

const $server_beautify = () => {
    let config = require(paths.config.beautify);
    return gulp.src(paths.serverside.cs)
        .pipe(beautify(config))
        .pipe(gulp.dest('./'));
}*/
// #endregion
// #region Styles
/** Parse SASS into CSS, append prefixes and minify (with sourcemap)
    param {any} done Callback
    @returns {Promise} Gulp promise
    @see https://github.com/postcss/gulp-postcss
    @see https://github.com/postcss/autoprefixer#options
    @see https://scotch.io/tutorials/prevent-errors-from-crashing-gulp-watch#toc-prevent-errors-from-breaking-tasks
*/
const styles_build_src = () => gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', (e) => {
        console.log(' - Failed to transcode Sass', e);
        //done(e);
    }).on('end', () => {
        console.log(' - ' + paths.styles.src + ' has been transcoded');
    })
    .pipe(rename({
        basename: 'icarus',
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
    .pipe(gulp.dest(paths.styles.dest));

/** Creates CSS Dependencies from external
    @returns {Promise} Gulp promise
*/
const styles_build_vendor = () => merge(
        request('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css')
        .pipe(source('bootstrap.css')),

        request('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css')
        .pipe(source('animate.css'))
    )
    .pipe(plumber({ errorHandler: onError }))
    .pipe(buffer())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(paths.styles.dest));

/** Retrieves font dependencies from external (CDN) and saves locally (src,dist)
    @param {any} done Callback
    @returns {void} 
    @see https://cdnjs.com/libraries/twitter-bootstrap/3.3.7
*/
const fonts_build_vendor = (done) => {
    //let dirs = ['src', 'dist'];
    //let filetypes = ['eot', 'svg', 'ttf', 'woff', 'woff2'];
    ['eot', 'svg', 'ttf', 'woff', 'woff2'].forEach((type) => {
        /*let file = request(
            'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.' + type
        );*/
        ['src', 'dist'].forEach((dir) => {
            request(
                'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.' + type
            ).pipe(source('glyphicons-halflings-regular.' + type))
                .pipe(gulp.dest('Content/styles/' + dir + '/fonts'));
        });
    });
    done();
}
/** Beautifies Sass Document
    @returns {gulp} A gulp object
*/
const styles_beautify_src = () => gulp
    .src(paths.styles.src, { base: './' })
    .pipe(beautify(require(paths.config.beautify)))
    .pipe(gulp.dest('./'));

/** Performs linting on Sass Stylesheet
    @param {any} done Callback
    @returns {gulp} A gulp object
    @see https://github.com/sasstools/sass-lint/tree/master/docs/rules
    @see https://github.com/sasstools/gulp-sass-lint/blob/master/tests/.sass-lint.yml
    @see https://github.com/sasstools/gulp-sass-lint#optionsrules
*/
const styles_lint_src = () => gulp
    .src(paths.styles.basefile) // './Content/styles/src/icarus/icarus.scss'
    .pipe(sasslint(require(paths.config.sasslint)))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError()).on('error', (e) => {
        console.log(' - Failed to lint Sass', e);
        //done(e);
    });

// #endregion
// #region Scripts

/** Terses Scripts and creates appropriate Sourcemaps
    @param {any} done Callback
    @returns {Promise} Gulp promise
 */
const scripts_build_src = () => gulp
    .src(paths.scripts.src, { base: paths.scripts.base })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(terser()).on('error', (e) => {
        console.log(' - Failed to terse Scripts', e);
        //done(e);
    }).on('success', () => {
        console.log(paths.scripts.src + ' has been successfully tersed');
    })/*.on('end', () => {
        done();
    })*/
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));

/** Creates Javascript Dependencies inside Scripts/dist 
    @param {any} done Callback
    @returns {Promise} Gulp promise
*/
const scripts_build_vendor = () => merge(
        request('https://code.jquery.com/jquery-3.3.1.min.js').pipe(source('jquery.js')),
        request('http://code.jquery.com/ui/1.12.1/jquery-ui.min.js').pipe(source('jqueryUI.js')),
        request('https://cdn.jsdelivr.net/npm/jquery-validation@1.17.0/dist/jquery.validate.min.js').pipe(source('jqueryValidate.js')),
        request('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js').pipe(source('bootstrap.js'))
    )
    .pipe(plumber({ errorHandler: onError }))
    .pipe(buffer())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.scripts.dest)).on('error', (e) => {
        console.log(' - Failed to publish vendor Scripts', e);
        //done(e);
    }).on('success', () => {
        console.log('Vendor scripts have been successfully published');
    });

/** ES6 Beautification
    @returns {Promise} Gulp promise
*/
const scripts_beautify_src = () => gulp
    .src(paths.scripts.src, { base: './' })
    .pipe(beautify(require(paths.config.beautify)))
    .pipe(gulp.dest('./'));

/** Lint the Scripts 'src' files
    @param {any} done Callback 
    @returns {Promise} Gulp promise
*/
const scripts_lint_src = () => gulp
    .src(paths.scripts.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(eslint(require(paths.config.eslint)))
    .pipe(eslint.format()).on('error', (e) => {
        console.log(' - Failed to lint Javascript', e);
    }).on('end', () => {
        console.log(' - Javascript linting complete');
    });
// #endregion
// #region Images
/** Optimize images
    @see https://www.npmjs.com/package/gulp4#incremental-builds 
    @returns {Promise} Gulp promise
function images() {
    return gulp.src(paths.images.src, { since: gulp.lastRun(images) })
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest(paths.images.dest));
}*/
// #endregion
// #region Documentation
/** Generates Style documentation using Sassdoc
    @returns {Promise} Gulp promise
*/
const document_styles = () => gulp
    .src(paths.styles.src)
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
    }));
/** Generates Script documentation using JSDoc3
    @returns {Promise} Gulp promise
*/
const document_scripts = () => gulp
    .src(paths.styles.src, { read: false })
    .pipe(jsdoc(require('./config/jsdoc.json')));
/** Generate C# Documentation using Doxygen
    @see https://stackoverflow.com/questions/36897877/gulp-error-the-following-tasks-did-not-complete-did-you-forget-to-signal-async
    @returns {Promise} Async promise
*/
const document_api = () => new Promise((resolve) => {
    doxygen.downloadVersion().then(() => {
        doxygen.createConfig(paths.config.doxygen); // config, 
        doxygen.run(paths.config.doxygen);
    });
    resolve();
});
/** Creates a static server at localhost:9000 to host Documentation
    @returns {Promise} Promise to create a server
*/
const serve_documentation = () => new Promise((resolve) => {
    let server = connect().use(servestatic('Documentation'));
    http.createServer(server).listen(9000);
    resolve(server);
});
// #endregion
// #region Tests 
/** Lint the Test files 
    @param {any} done Callback
    @returns {gulp} A gulp promise
*/
const tests_lint_src = () => gulp.src(paths.tests.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(eslint(require(paths.config.eslint)))
    .pipe(eslint.format()).on('error', () => {
        console.log(' - Failed to lint Tests');
    }).on('end', () => {
        console.log(' - Test linting complete');
    });
/** Creates a static server at localhost:9001 to host tests
    @returns {Promise<resolve>} Promise 
*/
const server_test = () => new Promise((resolve) => {
    let server = connect().use(servestatic('Scripts/test/fixtures'));
    http.createServer(server).listen(9001);
    resolve(server);
});
/** API Related testing fixtures
    @param {any} done Callback
    @returns {Promise<done>} Callback
*/
export const test_api = (done) => {
    console.log(' - Testing API');
    let server = server_test();
    done(server);
};
/** UI and Behavior testing using Puppeteer and Mocha
    @param {any} done Callback function
    @see https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
    @returns {Promise} Promise to launch Mocha and Puppeteer
*/
export const test_ui = (done) => {
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
// #endregion
// #region Publish
/** Deletes contents of dist folders 
    @returns {void}
*/
export const clean_dist = () => del(['Scripts/dist/', 'Content/styles/dist/']);
/** Publishes 'src' and 'dist' Script folders
    param {boolean} dev If true, push 'src' along with 'dist'
    @todo dev pushes 'src' and 'dist', while prod only has 'dist'
    @returns {gulp} A gulp promise
*/
const scripts_publish = () => gulp
    .src(['Scripts/**/**.*', '!**/deprec/**/**.*', '!**/test/**/**.*', '!**.(yml|md)'])
    .pipe(gulp.dest(paths.server.dev + 'Scripts'));
/** Publishes 'src' and 'dist' Style folders
    @param {boolean} dev If true, push 'src' along with 'dist'
    @todo dev pushes 'src' and 'dist', while prod only has 'dist'
    @returns {gulp} A gulp promise
*/
const styles_publish = () => gulp
    .src([paths.styles.baseglob, '!**.(yml|md)'])
    .pipe(gulp.dest(paths.server.dev + 'Content/styles'));
/** Publishes Scripts and Styles to the dev server 
    @param {any} done Callback
    @returns {gulp} A gulp series
*/
export const publification = gulp.series(
    (done) => {
        console.log('\n\n\n==== publish BEGIN ====');
        done();
    },
    scripts_build_vendor,
    styles_build_vendor,
    fonts_build_vendor,
    scripts_publish,
    styles_publish,
    (done) => {
        console.log('\n\n\n==== publish END ====');
        done();
    }
);
// #endregion
// #region Watch
/** Performs linting on Gulpfile 
    @param {any} done callback
    @returns {gulp} A gulp 
*/
const tasks_lint = () => gulp
    .src(paths.tasks.src).on('end', () => {
        console.log(' - Linting Tasks');
    })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(eslint(require(paths.config.eslint)))
    .pipe(eslint.format()).on('error', () => {
        console.log(' - Failed to lint Tasks');
    }).on('end', () => {
        console.log(' - Task linting complete');
    });
// #endregion
// #region Maintenance
/** Beautifies Scripts and Styles */ 
const beautification = gulp.series(
    (done) => {
        console.log('\n\n\n==== beautification BEGIN ====');
        done();
    },
    scripts_beautify_src,
    styles_beautify_src,
    (done) => {
        console.log('\n\n\n==== beautification END ====');
        done();
    }
);
/** Lints Scripts and Styles */
export const lintification = gulp.series(
    (done) => {
        console.log('\n\n\n==== lintification BEGIN ====');
        done();
    },
    scripts_lint_src,
    styles_lint_src,
    tasks_lint,
    (done) => {
        console.log('\n\n\n==== lintification END ====');
        done();
    }
);

export const documentation = gulp.series(
    (done) => {
        console.log('\n\n\n==== documentation BEGIN ====');
        done();
    },
    document_scripts,
    document_styles,
    document_api,
    serve_documentation,
    (done) => {
        console.log('\n\n\n==== documentation END ====');
        done();
    }
);
export const stylification = gulp.series(
    (done) => {
        console.log('\n\n\n==== stylification BEGIN ====');
        done();
    },
    // styles_lint_src,
    (done) => {
        console.log('\n\n\n==== stylification END ====');
        done();
    }
);

export const test = gulp.series(
    (done) => {
        console.log('\n\n\n==== test BEGIN ====');
        done();
    },
    //test_ui,
    //test_api,
    (done) => {
        console.log('\n\n\n==== test END ====');
        done();
    }
);

export const scriptification = gulp.series(
    (done) => {
        console.log('\n\n\n==== scriptification BEGIN ====');
        done();
    },
    scripts_build_src,
    scripts_build_vendor,
    (done) => {
        console.log('\n\n\n==== scriptification END ====');
        done();
    }
);
/** Beautifies 'src' Styles and Scripts, then performs linting.
    If lint returns no errors, the target environment is cleaned
    and 'dist' is built
 */
export const build = gulp.series(
    (done) => {
        console.log('\n\n\n==== build BEGIN ====');
        done();
    },
    beautification,
    lintification,
    clean_dist,
    stylification,
    scriptification,
    (done) => {
        console.log('\n\n\n==== build END ====');
        done();
    }
);

/** Lint, Build on Success, then publish */
const scripts_lintbuildpublish = gulp.series(
    (done) => {
        console.log('\n\n\n==== scripts_lintbuildpublish BEGIN ====');
        done();
    },
    scripts_lint_src,
    scripts_build_src,
    scripts_publish,
    test,
    (done) => {
        console.log('\n\n\n==== scripts_lintbuildpublish END ====');
        done();
    }
);
/** Lint, Build on Success, then publish */
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
    }
);

/** Performs watch tasks within a container that can be reset
    @see https://codepen.io/ScavaJripter/post/how-to-watch-the-same-gulpfile-js-with-gulp
    @returns {void}
*/
const slurp = () => {
    try {
        if (!gulp.slurped) {
            gulp.watch(paths.scripts.baseglob, scripts_lintbuildpublish).on('error', () => {
                console.log('Unable to lintbuildpublish scripts');
            }); //watch_scripts();  


            //gulp.watch(paths.scripts.baseglob, test_ui); // 
            gulp.watch(paths.styles.basefile, styles_lintbuildpublish).on('error', () => {
                console.log('Unable to lintbuildpublish styles');
            }); //watch_styles();

            gulp.watch(paths.tests.baseglob, tests_lint_src).on('error', () => {
                console.log('Unable to lint tests');
            }); //watch_tests();
            gulp.watch('gulpfile.babel.js', tasks_lint).on('error', () => {
                console.log('Unable to lint gulpfile');
            }); // watch_tasks();
            gulp.slurped = true;    
            console.log('Slurped');
        }
    } catch (e) {
        console.log('Choked.  Slurp failed.', e);
    }
}
/** Looping watch that reloads when gulpfile is changed  
    @returns {void}
*/
export const watch = () => {
    console.log('Slurping...');
    slurp();
}
// #endregion
/* eslint-enable max-lines */
/* eslint-enable no-undef */
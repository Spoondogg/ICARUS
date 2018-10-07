/// <binding AfterBuild='doc-generate' ProjectOpened='sass-watch, js-watch' />
// #region Head
"use strict";
/**
    This file is the main entry point for defining Gulp tasks and using Gulp plugins.
    @see https://go.microsoft.com/fwlink/?LinkId=518007
    @see https://www.davepaquette.com/archive/2014/10/08/how-to-use-gulp-in-visual-studio.aspx
    @see https://exceptionnotfound.net/using-gulp-js-and-the-task-runner-explorer-in-asp-net-5/
    @see https://github.com/gulpjs/gulp/blob/v3.9.1/docs/getting-started.md
*/
// #endregion
// #region Requires 
/** @namespace gulp */
var buffer = require('gulp-buffer');
/** Testing Framework */
var chai = require('chai');
/** Delete files on local drive */
var del = require('del');
/** Asset Bundling */
//var bundle = require('gulp-bundle-assets');
/** CSS Minification @see https://github.com/jakubpawlowicz/clean-css#formatting-options */
var cleanCSS = require('gulp-clean-css');
/** File combiner */
var concat = require('gulp-concat');
/** Connect to local server */
var connect = require('connect');
/** Full API Documentation */
var doxygen = require('doxygen');
/** ES6 Linting */
var eslint = require('gulp-eslint');
/** Gulp task runner */
//var gulp = require('gulp');   // 3.9.1
var gulp = require('gulp4');    // 4.0.2 alpha
/** Gulp utilities */
var gutil = require('gulp-util');
/** Allows HTTP requests */
var http = require('http');
/** Source Beautification @see https://www.npmjs.com/package/gulp-jsbeautifier */
var jsbeautify = require('gulp-jsbeautifier');
/** Javascript Linting */
var jslint = require('gulp-jslint');
/** Javascript Documentation @see https://www.npmjs.com/package/gulp-jsdoc3 */
var jsdoc = require('gulp-jsdoc3');
//var merge = require('merge-stream');
var merge = require('merge2');
/** Javascript Testing Framework */
var mocha = require('gulp-mocha');
/** Simple renaming @see https://www.npmjs.com/package/gulp-rename */
var rename = require("gulp-rename");
/** Request HTML page as stream */
var request = require('request');
//var rimraf = require("rimraf");
/** Transform Sass into Css */
var sass = require('gulp-sass');
/** Sass Linting @see https://www.npmjs.com/package/gulp-sass-lint */
var sassLint = require('gulp-sass-lint');
/** Generate Sass Documentation */
var sassdoc = require('sassdoc');
/** Serve a static html page */
var serveStatic = require('serve-static');
var source = require('vinyl-source-stream');
/** SourceMap generation */
var sourcemaps = require('gulp-sourcemaps');
/** Compresses es6+ code @see https://www.npmjs.com/package/gulp-terser */
var terser = require('gulp-terser');
//var uglify = require('gulp-uglify');
// #endregion
// #region Javascript 
/**
    Javascript files
    @memberof gulp
*/
let scripts = {
    src: [
        'Scripts/src/icarus/**/*.js',
        '!Scripts/dist/**/*',
        '!Scripts/deprec/**/*'
    ],
    eslint: [
        './Scripts/src/**/*.js',
        '!**/test/**/*.js', '!**/init.js', '!**/StringMethods.js'
    ],
    dist: 'Scripts/dist/icarus',
    format: {
        //config: './config.json',
        indent_char: '\t',
        indent_size: 1,
        js: {
            file_types: ['.js'],
            "indent_size": "1",
            "indent_char": "\t",
            "max_preserve_newlines": "-1",
            "preserve_newlines": false,
            "keep_array_indentation": false,
            "break_chained_methods": false,
            "indent_scripts": "normal",
            "brace_style": "collapse-preserve-inline",
            "space_before_conditional": true,
            "unescape_strings": false,
            "jslint_happy": false,
            "end_with_newline": false,
            "wrap_line_length": "0",
            "indent_inner_html": false,
            "comma_first": false,
            "e4x": true,
            "keep_function_indentation": true
        }
    }
};
/**
    Performs linting on ES6 Javascript files
    @memberof gulp
*/
gulp.task('js-eslint', () => {
    gutil.log('== ESLint ==')
    var config = require('./config/eslint.json');
    return gulp.src(scripts.eslint)
        .pipe(eslint(config))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());    
});
/**
    Creates Javascript Dependencies inside Scripts/dist
*/
function createJsDependencies() {
    var jquery = request('https://code.jquery.com/jquery-3.3.1.min.js').pipe(source('jquery.js'));
    var jqueryUI = request('http://code.jquery.com/ui/1.12.1/jquery-ui.min.js').pipe(source('jqueryUI.js'));
    var jqueryValidate = request('https://cdn.jsdelivr.net/npm/jquery-validation@1.17.0/dist/jquery.validate.min.js').pipe(source('jqueryValidate.js'));
    //var modernizr = request('https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js').pipe(source('modernizr.js'));
    var bootstrap = request('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js').pipe(source('bootstrap.js'));
    return merge(jquery, jqueryUI, jqueryValidate, /*modernizr,*/ bootstrap)
        .pipe(buffer())
        .pipe(concat('dependencies.js'))
        .pipe(gulp.dest('Scripts/dist'));
}
/**
    Merge dependencies from external sources into a single local file in Scripts/dist
    @see https://fettblog.eu/gulp-merge-cdn-files-into-your-pipeline/
    @see https://cdnjs.com/libraries/
*/
gulp.task('js-dependencies', () => {
    return createJsDependencies();
})
/**
    Linting of Javascript files
    @memberof gulp
*/
gulp.task('js-lint', () => {
    return gulp.src(scripts.src)
        .pipe(jslint())
        .pipe(jslint.reporter('default'));
});
/**
    Source code beautification using JSBeautify
*/
gulp.task('js-prettify', () => {
    gutil.log('== Beautifying Javascript ==')
    return gulp.src(scripts.src, { base: './' })
        .pipe(jsbeautify(scripts.format))
        .pipe(gulp.dest('./'));
});
/**
    Duplicates Scripts/icarus/src and compresses its files
    @returns {gulp} Minified icarus ES6
*/
function createJsMinified() {
    return gulp.src(scripts.src, { sourcemaps: true })
        //.pipe(gulp.dest(scripts.dist))
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./Scripts/dist/icarus')); //'./'        
}
/**
    Source code beautification using JSBeautify
*/
gulp.task('js-minify', () => {
    gutil.log('== Minifying ES6 Javascript ==')
    return createJsMinified();
});
/**
    Perform tasks when the files being monitored are modified
    @memberof gulp
    @see https://codereviewvideos.com/course/how-to-use-gulp/video/gulp-watch-example
*/
gulp.task('js-watch', () => {
    return gulp.watch(scripts.src, ['js-minify', 'js-eslint']);
});
// #endregion
// #region Stylesheets
/**
    An array of Sass Stylesheets
    @memberof gulp
*/
let stylesheets = {
    src: 'Content/css/src/icarus/icarus.scss',
    dist: 'Content/css/dist/icarus',
    output: 'Content/css/dist/icarus/icarus.css',
    format: {
        //config: './config.json',
        indent_char: '\t',
        indent_size: 1,
        css: {
            file_types: ['.css'],
            "indent_size": "1",
            "indent_char": "\t",
            "max_preserve_newlines": "-1",
            "preserve_newlines": false,
            "keep_array_indentation": false,
            "break_chained_methods": false,
            "indent_scripts": "normal",
            "brace_style": "collapse-preserve-inline",
            "space_before_conditional": true,
            "unescape_strings": false,
            "jslint_happy": false,
            "end_with_newline": false,
            "wrap_line_length": "0",
            "indent_inner_html": false,
            "comma_first": false,
            "e4x": true,
            "keep_function_indentation": true
        }
    }
};
/**
    Creates CSS Dependencies from external
*/
function createCssDependencies() {
    var bootstrap = request('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css')
        .pipe(source('bootstrap.css'));
    var animate = request('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css')
        .pipe(source('animate.css'));
    return merge(bootstrap, animate)
        .pipe(buffer())
        .pipe(concat('dependencies.css'))
        .pipe(gulp.dest('Content/css/dist'));
}
/**
    Merge dependencies from external sources into a single local file
    var main = gulp.src('Scripts/src/icarus/.js');
    @see https://fettblog.eu/gulp-merge-cdn-files-into-your-pipeline/
    @see https://cdnjs.com/libraries/
*/
gulp.task('css-dependencies', () => {
    return createCssDependencies();
})
/**
    Creates a prettified CSS document from stylesheets.src,
    beautifies it and attaches a sourcemap to the original Sass 
    @returns {gulp} A Css Gulp
*/
function createCss() {
    return gulp.src(stylesheets.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(jsbeautify(stylesheets.format))
        .pipe(gulp.dest(stylesheets.dist));
}
/**
    Creates CSS file(s) from given SASS File(s) and appends to dist
    @memberof gulp
    @see https://www.npmjs.com/package/gulp-sass
*/
gulp.task('sass-transform-css', ['sass-prettify'], () => {
    return createCss();    
});
/**
    Creates minified CSS file(s) from the given SASS file(s), 
    appends '.min' to its name and saves to dist
*/
function createCssMinified() {
    return gulp.src(stylesheets.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename((path) => {
            path.basename += '.min';
        }))
        //.pipe(sourcemaps.init())
        .pipe(cleanCSS({ /*compatibility: 'ie8'*/ }))
        //.pipe(sourcemaps.write('./'))
        
        .pipe(gulp.dest(stylesheets.dist));
}
/**
    Minifies icarus.css into icarus.min.css
    @see https://github.com/jakubpawlowicz/clean-css#constructor-options
    @returns {void}
*/
gulp.task('sass-minify', () => {
    return createCssMinified();
});
/**
    Lints SASS documents
    @memberof gulp
    @see https://github.com/sasstools/gulp-sass-lint
*/
gulp.task('sass-lint', () => {
    return gulp.src(stylesheets.src)
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});
/**
    Source code beautification using JSBeautify
    @see https://github.com/beautify-web/js-beautify#options
*/
gulp.task('sass-prettify', () => {
    gutil.log('== Beautifying SASS ==')
    return gulp.src(stylesheets.src, { base: './' }).pipe(jsbeautify({
        //config: './config.json',
        indent_char: '\t',
        indent_size: 1,
        scss: {
            file_types: ['.scss'],
            "indent_size": "1",
            "indent_char": "\t",
            "max_preserve_newlines": "-1",
            "preserve_newlines": false,
            "keep_array_indentation": false,
            "break_chained_methods": false,
            "indent_scripts": "normal",
            "brace_style": "collapse-preserve-inline",
            "space_before_conditional": true,
            "unescape_strings": false,
            "jslint_happy": false,
            "end_with_newline": false,
            "wrap_line_length": "0",
            "indent_inner_html": false,
            "comma_first": false,
            "e4x": true,
            "keep_function_indentation": true
        }
    })).pipe(gulp.dest('./'));
});
/**
    Source code beautification using JSBeautify
    @see https://github.com/beautify-web/js-beautify#options
*/
gulp.task('css-prettify', () => {
    gutil.log('== Beautifying CSS ==')
    return gulp.src(stylesheets.output, { base: './' })
        .pipe(jsbeautify(stylesheets.format))
        .pipe(gulp.dest('./'));
});
/**
    Generates the css document from the given Sass file and
    updates Sass documentation 
    @memberof gulp
*/
gulp.task('sass-watch', () => {
    return gulp.watch(stylesheets.src, ['sass-prettify', 'sass-lint', 'sass']); //'minify-css',
});
// #endregion
// #region Tests
/**
    An array of tests to be ran
*/
let tests = {
    src: ['Scripts/src/icarus/test/specs/testpalindrome.js']
};
/**
    Launch a local server for testing
*/
gulp.task('_http', (done) => {
    const appTest = connect().use(serveStatic('Scripts/src/icarus'));
    http.createServer(appTest).listen(9000, done);
});
/**
    Unit Testing with Mocha
    @see https://gulpjs.org/recipes/mocha-test-runner-with-gulp.html
*/
gulp.task('_test', () => {
    return gulp.src(tests.src, { read: false })
        .pipe(mocha({ reporter: 'spec' }))
});
// #endregion
// #region Documentation
gulp.task('doc-generate', () => {
    documentSass();
    documentJavascript();
    documentApi();    
});
/**
    Generates Javascript documentation using jsdoc3
*/
function documentJavascript() {
    var cfg = require('./config/jsdoc.json');
    return gulp.src(scripts.src, { read: false })
        .pipe(jsdoc(cfg));
}
/**
    Generates the Javascript JSDoc Documentation
    @memberof gulp
    @see https://www.npmjs.com/package/gulp-jsdoc3
    @see https://github.com/shri/JSDoc-Style-Guide
*/
gulp.task('doc-jsdoc', () => {
    //gutil.log('== Creating JSDocs ==')
    return documentJavascript();
});
/**
    Generates API Documentation
*/
function documentApi() {
    var userOptions = {
        PROJECT_NAME: "Icarus",
        PROJECT_NUMBER: "0.5.2",
        //PROJECT_BRIEF: "A single page web application and sandbox",
        PROJECT_LOGO: "Content/icon50.png",
        OUTPUT_DIRECTORY: "Documentation/doxygen",
        //INPUT: "Content/css/icarus/icarus.scss Controllers/ Scripts/src/icarus/ Views/",
        INPUT: "Controllers/ Views/",
        //INPUT: "./",
        //INPUT: "./**/*.cs",
        //INPUT: './index.md',
        RECURSIVE: "YES",
        FILE_PATTERNS: ["*.cs"], // "*.md", "*.js", "*.scss", "*.css", "*.cshtml"
        EXTENSION_MAPPING: "cs=C#", // js=Javascript scss=SASS
        GENERATE_LATEX: "NO",
        EXCLUDE_PATTERNS: ["*/node_modules/*"],
        MARKDOWN_SUPPORT: "YES",
        USE_MDFILE_AS_MAINPAGE: "./index.md"
    };    
    doxygen.downloadVersion().then(function (data) {
        doxygen.createConfig(userOptions, './config/doxygen.config');
        doxygen.run('./config/doxygen.config');
    });
    //doxygen.createConfig(userOptions, 'doxygen.config');
    //doxygen.run('doxygen.config'); //'doxygen.config'
}

/**
    Generates the C# Documentation and API using Doxygen
    @memberof gulp
    @see https://www.npmjs.com/package/doxygen
    @see https://stackoverflow.com/questions/9502426/how-to-make-an-introduction-page-with-doxygen
    @see https://www.stack.nl/~dimitri/doxygen/manual/config.html#cfg_project_name
    @see https://gist.github.com/ugovaretto/261bd1d16d9a0d2e76ee
*/
gulp.task('doc-doxygen', () => {
    documentApi();
});
/**
    Generates Sass Documentation using SassDoc
    @returns {gulp} A gulp
*/
function documentSass() {
    return gulp.src(stylesheets.src).pipe(sassdoc({
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
}
/**
    Generates the C# API Documentation
    @memberof gulp
*/
gulp.task('doc-sassdoc', () => {
    return documentSass();
});
// #endregion
// #region Maintenance
/**
    Remove all files from the dist directories
    del is an async function and not a gulp plugin (just standard nodejs)
	It returns a promise, so make sure you return that from this task function
	so gulp knows when the delete is complete
    @memberof gulp
    @method
*/
gulp.task('_clean', () => {
    return del([
        'Scripts/dist/**/**.*',
        'Content/css/dist/**/**.*',
    ]);
});
// #endregion

gulp.task('js-publish-dev', ['js-build'], () => {
    gulp.src('./Scripts/dist/**/**.*')
        .pipe(gulp.dest('I:/iis/dev/Scripts/dist')); // I:\iis\dev\Scripts
});
/**
    Builds Javascript Dependencies and minifies src to dist
*/
function buildJS() {
    gutil.log('== Creating Javascript Dependencies ==')
    createJsDependencies();
    gutil.log('== Creating SCRIPT Icarus dist  ==')
    createJsMinified();
}
gulp.task('js-build', () => {
    buildJS();
});
/**
    The default Gulp task
        - Creates dependencies
        - Compiles dist for Scripts and Styles
        - Compiles minified versions of dist files
    @method
    @memberof gulp
*/
gulp.task('default', ['_clean'], () => { // js-eslint, sass-lint
    gutil.log('== Creating CSS Dependencies ==')
    createCssDependencies();

    gutil.log('== Creating CSS dist ==')
    createCss();

    gutil.log('== Creating CSS Icarus Minified dist  ==')
    createCssMinified();

    buildJS();
});
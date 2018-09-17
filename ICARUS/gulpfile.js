/// <binding ProjectOpened='watchJs, watchSass' />
"use strict";
/**
    This file is the main entry point for defining Gulp tasks and using Gulp plugins.
    Click here to learn more. https://go.microsoft.com/fwlink/?LinkId=518007
    @see https://www.davepaquette.com/archive/2014/10/08/how-to-use-gulp-in-visual-studio.aspx
    @see https://exceptionnotfound.net/using-gulp-js-and-the-task-runner-explorer-in-asp-net-5/
    @see https://github.com/gulpjs/gulp/blob/v3.9.1/docs/getting-started.md
*/
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rimraf = require("rimraf");
var merge = require('merge-stream');
var del = require('del');
var sassdoc = require('sassdoc');
var jsdoc = require('gulp-jsdoc3');
var rename = require("gulp-rename");
var doxygen = require('doxygen');
var jslint = require('gulp-jslint');
//var eslint = require('gulp-eslint');

/**
    Javascript files
*/
var scripts = {
    src: ['Scripts/icarus/**/*.js', '!Scripts/icarus/bundles/*.js']
};
/**
    Sass Stylesheets
*/
var stylesheets = {
    src: ['Content/css/icarus/scss/icarus.scss']
};

/*
gulp.task('eslint', function () {
    gulp.src(['Scripts/icarus/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});
*/

/**
    Generates the Javascript JSDoc Documentation
    @see https://www.npmjs.com/package/gulp-jsdoc3
    @see https://github.com/shri/JSDoc-Style-Guide
*/
gulp.task('jsdoc', function (cb) {
    var cfg = require('./jsdoc.json');
    gulp.src(scripts.src, { read: false })
        .pipe(jsdoc(cfg, cb));
});

/**
    Perform tasks when the files being monitored are modified
    @see https://codereviewvideos.com/course/how-to-use-gulp/video/gulp-watch-example
*/
gulp.task('watchJs', function () {
    return gulp.watch(scripts.src, ['scripts', 'jsdoc']);
});

gulp.task('jslint', function () {
    return gulp.src(scripts.src)
        .pipe(jslint({ /* this object represents the JSLint directives being passed down */ }))
        .pipe(jslint.reporter('default'));
});

gulp.task('watchSass', function () {
    
    return gulp.watch(stylesheets.src, ['sassdoc']);
});

/**
    Generates the C# Documentation and API using Doxygen
    @see https://www.npmjs.com/package/doxygen
    @see https://stackoverflow.com/questions/9502426/how-to-make-an-introduction-page-with-doxygen
    @see https://www.stack.nl/~dimitri/doxygen/manual/config.html#cfg_project_name
    @see https://gist.github.com/ugovaretto/261bd1d16d9a0d2e76ee
*/
gulp.task('doxygen', function () {    
    var userOptions = {
        PROJECT_NAME: "Icarus",
        PROJECT_NUMBER: "0.5.2",
        //PROJECT_BRIEF: "A single page web application and sandbox",
        PROJECT_LOGO: "Content/icon50.png",
        OUTPUT_DIRECTORY: "Documentation/doxygen",
        //INPUT: "Content/css/icarus/scss/icarus.scss Controllers/ Scripts/icarus/ Views/",
        INPUT: "./",
        //INPUT: "./**/*.cs",
        //INPUT: './index.md',
        RECURSIVE: "YES",
        FILE_PATTERNS: ["*.cs", "*.md", "*.js", "*.scss", "*.css", "*.cshtml"],
        EXTENSION_MAPPING: "cs=C# js=Javascript scss=SASS",
        GENERATE_LATEX: "NO",
        EXCLUDE_PATTERNS: ["*/node_modules/*"],
        MARKDOWN_SUPPORT: "YES",
        USE_MDFILE_AS_MAINPAGE: "./index.md"
    };
    doxygen.createConfig(userOptions, 'doxygen.config');
    doxygen.run('doxygen.config');
});



/**
    Generates the SASS Documentation
*/
gulp.task('sassdoc', function () {
    var options = {
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
    };

    return gulp.src('Content/css/icarus/scss/icarus.scss')
        .pipe(sassdoc(options));
});

/**
    Standard minification and bundling
*/
gulp.task('minify', function () {
    var streams = [
        gulp.src(scripts.src)
            //.pipe(uglify())
            //.pipe(concat("icarus-gulp.min.js"))
            .pipe(gulp.dest('Scripts/icarus/bundles/min'))
    ];
    return merge(streams);
});

/* ---------------------------------------------------------------------------------- */

/**
    Delete any leftover output file(s)
*/
gulp.task('clean', function () {
    //del is an async function and not a gulp plugin (just standard nodejs)
    //It returns a promise, so make sure you return that from this task function
    //  so gulp knows when the delete is complete
    return del(['Scripts/icarus/bundles/icarus-gulp-bundled.js']);
});

/**
    Combine and minify all files from the app folder
    This tasks depends on the clean task which means gulp will ensure that the 
    Clean task is completed before running the scripts task.
*/
gulp.task('scripts', ['clean'], function () {
    return gulp.src(scripts.src)
        //.pipe(uglify())
        .pipe(concat('icarus-gulp-bundled.js'))
        //.pipe(gulp.dest('Scripts/icarus/bundles/' + (new Date()).getTime() + '/')); // https://www.npmjs.com/package/gulp-rename
        //.pipe(gulp.dest('Scripts/icarus/bundles/' + new Date() + '/')); // https://www.npmjs.com/package/gulp-rename
        .pipe(gulp.dest('Scripts/icarus/bundles/')); // https://www.npmjs.com/package/gulp-rename
});

/**
    A default task
*/
gulp.task('default', ['scripts'], function () {

}); //'minify'
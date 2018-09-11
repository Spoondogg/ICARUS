/// <binding AfterBuild='doxygen' ProjectOpened='watchJs, watchSass' />
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

/**
    Javascript files
*/
var scripts = {
    src: ['Scripts/icarus/**/*.js', '!Scripts/icarus/bundles/*.js', '!Scripts/icarus/lib/*.js']
}

/**
    SASS Stylesheets
*/
var stylesheets = {
    src: ['Content/css/icarus/scss/icarus.scss']
}

/**
    Perform tasks when the files being monitored are modified
    @see https://codereviewvideos.com/course/how-to-use-gulp/video/gulp-watch-example
*/
gulp.task('watchJs', function () {
    return gulp.watch(scripts.src, ['scripts', 'jsdoc']);
});
gulp.task('watchSass', function () {
    return gulp.watch(stylesheets.src, ['sassdoc']);
});


gulp.task('doxygen', function () {

    //https://www.npmjs.com/package/doxygen
    //https://stackoverflow.com/questions/9502426/how-to-make-an-introduction-page-with-doxygen
    var userOptions = {
        PROJECT_NAME: 'Icarus',
        OUTPUT_DIRECTORY: 'Documentation/doxygen',
        INPUT: './**/*',
        RECURSIVE: 'YES',
        FILE_PATTERNS: ['*.cs', '*.md', '*.dox'],
        EXTENSION_MAPPING: 'cs=C#',
        GENERATE_LATEX: 'NO',
        EXCLUDE_PATTERNS: ['*/node_modules/*'],
        MARKDOWN_SUPPORT: 'YES',
        //INPUT: './README.md',
        USE_MDFILE_AS_MAINPAGE: './README.md'
    };

    /*
    doxygen.downloadVersion().then(function (data) {
        doxygen.createConfig(userOptions).run();
        //doxygen.run()
    });
    */
    doxygen.createConfig(userOptions).run();

    
    //return gulp.pipe(doxygen.run());
});

// https://www.npmjs.com/package/gulp-jsdoc3
gulp.task('jsdoc', function (cb) {
    var cfg = require('./jsdoc.json');
    gulp.src(scripts.src, { read: false })
        .pipe(jsdoc(cfg, cb));
});

gulp.task('sassdoc', function () {
    var options = {
        dest: 'Documentation/sassdoc',
        verbose: true,
        display: {
            access: ['public', 'private'],
            alias: true,
            watermark: true,
        },
        groups: {
            'undefined': 'Ungrouped',
            foo: 'Foo group',
            bar: 'Bar group',
        },
        basePath: 'https://github.com/Spoondogg/ICARUS/blob/master/ICARUS/Content/css/icarus/scss/',
    };

    return gulp.src('Content/css/icarus/scss/icarus.scss')
        .pipe(sassdoc(options));
});

//delete the output file(s)
gulp.task('clean', function () {
    //del is an async function and not a gulp plugin (just standard nodejs)
    //It returns a promise, so make sure you return that from this task function
    //  so gulp knows when the delete is complete
    return del(['Scripts/icarus/bundles/icarus-gulp-bundled.js']);
});

// Combine and minify all files from the app folder
// This tasks depends on the clean task which means gulp will ensure that the 
// Clean task is completed before running the scripts task.
gulp.task('scripts', ['clean'], function () {
    return gulp.src(scripts.src)
        //.pipe(uglify())
        .pipe(concat('icarus-gulp-bundled.js'))
        .pipe(gulp.dest('Scripts/icarus/bundles/' + ((new Date()).getTime()) + '/')); // https://www.npmjs.com/package/gulp-rename
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

/**
    A default task
*/
gulp.task('default', ['scripts'], function () {

}); //'minify'
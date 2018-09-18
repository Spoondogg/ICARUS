/// <binding ProjectOpened='watchJs, watchSass' />
"use strict";
/**
    This file is the main entry point for defining Gulp tasks and using Gulp plugins.
    Click here to learn more. https://go.microsoft.com/fwlink/?LinkId=518007
    @see https://www.davepaquette.com/archive/2014/10/08/how-to-use-gulp-in-visual-studio.aspx
    @see https://exceptionnotfound.net/using-gulp-js-and-the-task-runner-explorer-in-asp-net-5/
    @see https://github.com/gulpjs/gulp/blob/v3.9.1/docs/getting-started.md
*/
/**
    @namespace gulp
*/
var gulp = require('gulp');
var gutil = require('gulp-util');
//var uglify = require('gulp-uglify');
var prettify = require('gulp-jsbeautifier');
var concat = require('gulp-concat');
//var rimraf = require("rimraf");
var merge = require('merge-stream');
var del = require('del');
var sassdoc = require('sassdoc');
var jsdoc = require('gulp-jsdoc3');
//var rename = require("gulp-rename");
var doxygen = require('doxygen');
var jslint = require('gulp-jslint');
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
/**
    Javascript files
    @memberof gulp
*/
let scripts = {
	src: ['Scripts/icarus/**/*.js', 'gulpfile.js', '!Scripts/icarus/bundles/*.js', '!Scripts/icarus/_deprec/*.js']
};
/**
    Sass Stylesheets
    @memberof gulp
*/
let stylesheets = {
	src: ['Content/css/icarus/scss/icarus.scss']
};
/**
    Source code beautification
    scripts.src
*/
gulp.task('prettify-js', function() {
	gutil.log('== Beautifying Javascript ==')
	return gulp.src(scripts.src, { base: './' }).pipe(prettify({
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
	})).pipe(gulp.dest('./'));
});
/**
    Performs linting on ES6 Javascript files
    @memberof gulp
*/
gulp.task('eslint', function() {
	gutil.log('== ESLint ==')
	return gulp.src(scripts.src)
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
/**
    Generates the Javascript JSDoc Documentation
    @memberof gulp
    @see https://www.npmjs.com/package/gulp-jsdoc3
    @see https://github.com/shri/JSDoc-Style-Guide
*/
gulp.task('jsdoc', function(cb) {
	gutil.log('== Creating JSDocs ==')
	var cfg = require('./jsdoc.json');
	return gulp.src(scripts.src, { read: false }).pipe(jsdoc(cfg, cb));
});
/**
    Perform tasks when the files being monitored are modified
    @memberof gulp
    @see https://codereviewvideos.com/course/how-to-use-gulp/video/gulp-watch-example
*/
gulp.task('watchJs', function() {
	return gulp.watch(scripts.src, ['prettify-js', 'jsdoc']);
});
/**
    Linting of Javascript files
    @memberof gulp
*/
gulp.task('jslint', function() {
	return gulp.src(scripts.src).pipe(jslint({ /* this object represents the JSLint directives being passed down */ })).pipe(jslint.reporter('default'));
});
/**
    Creates CSS file(s) from given SASS File(s)
    @memberof gulp
    @see https://www.npmjs.com/package/gulp-sass
*/
gulp.task('sass', function() {
	return gulp.src(stylesheets.src).pipe(sass().on('error', sass.logError)).pipe(gulp.dest('Content/css/icarus/css'));
});
/**
    Generates the css document from the given Sass file and
    updates Sass documentation 
    @memberof gulp
*/
gulp.task('watchSass', function() {
	return gulp.watch(stylesheets.src, ['sass', 'sassdoc']);
});
/**
    Generates the C# Documentation and API using Doxygen
    @memberof gulp
    @see https://www.npmjs.com/package/doxygen
    @see https://stackoverflow.com/questions/9502426/how-to-make-an-introduction-page-with-doxygen
    @see https://www.stack.nl/~dimitri/doxygen/manual/config.html#cfg_project_name
    @see https://gist.github.com/ugovaretto/261bd1d16d9a0d2e76ee
*/
gulp.task('doxygen', function() {
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
    @memberof gulp
*/
gulp.task('sassdoc', function() {
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
	return gulp.src('Content/css/icarus/scss/icarus.scss').pipe(sassdoc(options));
});
/**
    Standard minification and bundling
    @memberof gulp
    @method
*/
gulp.task('minify', function() {
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
    @memberof gulp
    @method
*/
gulp.task('clean', function() {
	//del is an async function and not a gulp plugin (just standard nodejs)
	//It returns a promise, so make sure you return that from this task function
	//  so gulp knows when the delete is complete
	return del(['Scripts/icarus/bundles/icarus-gulp-bundled.js']);
});
/**
    Combine and minify all files from the app folder
    This tasks depends on the "clean" task which means gulp will ensure that the 
    Clean task is completed before running the scripts task.
    @memberof gulp
    @method
*/
gulp.task('scripts', ['clean'], function() {
	return gulp.src(scripts.src)
		//.pipe(uglify())
		.pipe(concat('icarus-gulp-bundled.js'))
		//.pipe(gulp.dest('Scripts/icarus/bundles/' + (new Date()).getTime() + '/')); // https://www.npmjs.com/package/gulp-rename
		//.pipe(gulp.dest('Scripts/icarus/bundles/' + new Date() + '/')); // https://www.npmjs.com/package/gulp-rename
		.pipe(gulp.dest('Scripts/icarus/bundles/')); // https://www.npmjs.com/package/gulp-rename
});
/**
    The default gulp task
    @method
    @memberof gulp
*/
gulp.task('default', ['scripts'], function() {}); //'minify'
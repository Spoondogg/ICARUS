/// <binding AfterBuild='publification_dev' />
/** This file interacts with Visual Studio's Task Runner to call methods of a GULPFILE    
    Where possible, GULPFILE.js should import all required Node Modules
    and imports for this file should be reserved for modules that have been 
    installed globally. (ie: 'gulp4') or paths and configurations
    @module 
*/
import GULPFILE from './Scripts/src/icarus/task/gulp/GULPFILE.js'; //GULPPATHS
//import autoprefixer from 'autoprefixer';
//import babel from 'gulp-babel';
//import buffer from 'gulp-buffer';
//import cleancss from 'gulp-clean-css';
//import concat from 'gulp-concat';
//import connect from 'connect';
//import del from 'del';
import doxygen from 'doxygen';
//import eslint from 'gulp-eslint';
//import fs from 'file-system';
import gulp from 'gulp4';
//import gutil from 'gulp-util';
//import http from 'http';
//import jsdoc from 'gulp-jsdoc3';
//import merge from 'merge2';
//import notify from 'gulp-notify';
//import path from 'path';
//import plumber from 'gulp-plumber';
//import postcss from 'gulp-postcss';
//import postcssfontsmoothing from 'postcss-font-smoothing';
//import postcssmomentumscrolling from 'postcss-momentum-scrolling';
//import postcsstouchcallout from 'postcss-touch-callout';
//import rename from 'gulp-rename';
//import request from 'request';
//import sass from 'gulp-sass';
//import sassdoc from 'sassdoc';
//import sasslint from 'gulp-sass-lint';
//import servestatic from 'serve-static';
//import source from 'vinyl-source-stream';
//import sourcemaps from 'gulp-sourcemaps';
//import terser from 'gulp-terser';
/** The Gulp Helper Class */
const gulpfile = new GULPFILE(gulp);
/** Indicates if the file has been slurped
    @see https://codepen.io/ScavaJripter/post/how-to-watch-the-same-gulpfile-js-with-gulp
*/
gulp.slurped = false;
/** Instantiate a GulpFile and begin watching for changes
    @returns {void}
*/
export const Watch = () => gulpfile.slurp();
/** Builds App
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const Build = (done) => gulpfile.build()(done);
/** Builds Vendor Scripts
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const BuildVendor = (done) => gulpfile.buildVendorAll()(done);
/** Beautify Scripts and Styles
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const Beautify = (done) => gulpfile.beautifyAll()(done);
/** Lint Scripts and Styles
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const Lint = (done) => gulpfile.lintAll()(done);
/** Builds Documentation
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const BuildDocumentation = (done) => gulpfile.buildDocumentation(doxygen)(done);
/** Builds Client Side Documentation
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const BuildClientDocumentation = (done) => gulpfile.documentClient()(done);
/** Serves Documentation
    @returns {void}
*/
export const ServeDocumentation = () => gulpfile.serveDocumentation();
// REQUIRED
//const { expect } = require('chai');
const _ = require('lodash');
//const globalVariables = _.pick(global, ['browser', 'expect']);
const globalVariables = _.pick(global, ['browser']);
/** Instantiate a GulpFile and begin watching for changes
    @param {global} global NodeJS.Global globalVariables
    @param {browser} browser WebdriverIO.Client
    @returns {void}
*/
export const Test = () => gulpfile.test(globalVariables);
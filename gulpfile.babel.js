/// <binding AfterBuild='publification_dev' />
// #region Head
// #region Imports
/** @module */
//import autoprefixer from 'autoprefixer';
//import babel from 'gulp-babel';
//import beautify from 'gulp-jsbeautifier';
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
import GULPFILE from './Scripts/src/icarus/task/gulp/GULPFILE.js'; //GULPPATHS
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
/** Indicates if the file has been slurped
    @see https://codepen.io/ScavaJripter/post/how-to-watch-the-same-gulpfile-js-with-gulp
*/
gulp.slurped = false;
// #endregion Config
/** Instantiate a GulpFile and begin watching for changes
    @returns {void}
*/
export const _GF_Watch = () => new GULPFILE(gulp).slurp();
/** Instantiate a GulpFile and begin watching for changes
    @returns {void}
*/
export const _GF_Build = () => new GULPFILE(gulp).build();
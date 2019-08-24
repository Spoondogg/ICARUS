/// <binding AfterBuild='BuildVendorDependencies' />
/** Interface between Task Runner and GULPFILE
    @module 
*/
//import GULPFILE from './Scripts/src/icarus/task/gulp/GULPFILE.js'; //GULPPATHS
import GulpBuild from './Scripts/src/icarus/task/gulp/GULPBuild/GulpBuild.js';
import GulpDocument from './Scripts/src/icarus/task/gulp/GULPDocument/GulpDocument.js';
import GulpPublish from './Scripts/src/icarus/task/gulp/GULPPublish/GulpPublish.js';
import GulpSyntax from './Scripts/src/icarus/task/gulp/GULPSyntax/GulpSyntax.js';
import GulpTest from './Scripts/src/icarus/task/gulp/GULPTest/GulpTest.js';
import GulpWatch from './Scripts/src/icarus/task/gulp/GULPWatch/GulpWatch.js';
import gulp from 'gulp4';
gulp.slurped = false; // https://codepen.io/ScavaJripter/post/how-to-watch-the-same-gulpfile-js-with-gulp

/** Determines if source (true) or distribution (false) 
    assets are pushed to the target environment
    @type {boolean}
*/
const debug = false;
const builder = new GulpBuild();
const scribe = new GulpDocument();
const publisher = new GulpPublish();
const auditer = new GulpSyntax();
const tester = new GulpTest();
const watcher = new GulpWatch();
/** Builds App using DEV profile
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const BuildDev = (done) => builder.build()(done);
/** Builds App using PROD profile
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const BuildProd = (done) => builder.build(false)(done);
/** Audits Source and Beautifies Scripts and Styles
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const AuditStyle = (done) => auditer.beautifyAll()(done);
/** Audits Source and Lints Scripts and Styles
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const AuditSyntax = (done) => auditer.lintAll()(done);
/** Builds Documentation
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const BuildDocumentation = (done) => scribe.buildDocumentation()(done);
/** Builds Client Side Documentation
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const BuildClientDocumentation = (done) => scribe.documentClient()(done);
/** Builds Vendor Dependencies to DIST (Scripts, Styles and Fonts)
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const BuildVendorDependencies = (done) => builder.buildVendorAll()(done);
/** Removes SRC folders from the DEV Server
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const CleanDev = (done) => builder.cleanDev()(done);
/** Publish to DEV Server using DEV Profile
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const PublishToDev = (done) => publisher.publishToDev()(done);
/** Publish to DEV Server using PROD Profile
    @param {done} done Resolver/Callback
    @returns {void}
*/
export const PublishToProd = (done) => publisher.publishToDev(false)(done);
/** Serves Documentation
    @returns {void}
*/
export const ServeDocumentation = () => scribe.serveDocumentation();
/** Instantiate a GulpFile and begin watching for changes
    @param {global} global NodeJS.Global globalVariables
    @param {browser} browser WebdriverIO.Client
    @returns {void}
*/
//const _ = require('lodash');
//const globalVariables = _.pick(NodeJS.global, ['browser']);
export const Test = () => tester.test(); //globalVariables
/** Instantiate a GulpFile and begin watching for changes
    @returns {void}
*/
export const Watch = () => watcher.slurp();
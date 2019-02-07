import GULPFILE, { GULPPATHS, del } from '../GULPFILE.js';
import GulpSyntax from '../GULPSyntax/GulpSyntax.js';
import autoprefixer from 'autoprefixer';
import buffer from 'gulp-buffer';
import cleancss from 'gulp-clean-css';
import concat from 'gulp-concat';
import merge from 'merge2';
import postcss from 'gulp-postcss';
import postcssfontsmoothing from 'postcss-font-smoothing';
import postcssmomentumscrolling from 'postcss-momentum-scrolling';
import postcsstouchcallout from 'postcss-touch-callout';
import rename from 'gulp-rename';
import request from 'request';
import sass from 'gulp-sass';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
/** GulpFile that performs Build tasks
    @class
    @extends GULPFILE
*/
export default class GulpBuild extends GULPFILE {
	constructor() {
		super();
		this.auditor = new GulpSyntax();
	}
	/** Beautifies SRC Styles and Scripts, then performs linting.
	    If lint returns no errors, the target environment is cleaned and 'dist' is built
        @param {boolean} dev If true, sourcemaps are included and minification is optional
	    @returns {gulp.series} Series
	*/
	build(dev = true) {
		let profile = dev ? 'DEV' : 'PROD';
		return this.gulp.series(
			//(done) => this.logEntryPoint('GulpBuild.build(' + profile + ')', done),
			(done) => this.logCompletion('==============> GulpBuild.build(' + profile + ')', done),
			(done) => this.auditor.beautifyAll()(done),
			(done) => this.auditor.lintAll()(done),
			(done) => this.buildStyles(done, GULPPATHS.styles.src, GULPPATHS.server.dev + GULPPATHS.styles.dest, 'icarus', dev),
			(done) => this.buildAllScripts(dev)(done));
	}
	/** Builds Source and Vendor Scripts
        @param {boolean} dev If true (default), then Sourcemaps are written
	    @returns {gulp.series} Series
	*/
	buildAllScripts(dev = true) {
		return this.gulp.series(
			(done) => this.buildScripts(done, GULPPATHS.scripts.src, GULPPATHS.server.dev + GULPPATHS.scripts.dest, dev),
			(done) => this.buildVendorScripts(done));
	}
	/** Creates a Pipe for Building Scripts
	    @param {string} src Source Path
        @param {string} dest Destination path
        @param {string} basename Stylesheet filename
        @param {boolean} dev If true (default), then Sourcemaps are written
	    @returns {gulp.pipe.stream} A gulp 
	*/
	buildStylesStream(src, dest, basename, dev = true) {
		try {
			let stream = this.gulp.src(src);
			stream = dev ? stream.pipe(sourcemaps.init()) : stream;
			stream = stream.pipe(sass());
			stream = stream.pipe(rename({
				basename,
				suffix: '.min'
			}));
			stream = stream.pipe(this.pluginPostCss());
			stream = stream.pipe(cleancss({ /*compatibility: 'ie8'*/ }));
			stream = dev ? stream.pipe(sourcemaps.write('.')) : stream;
			stream = stream.pipe(this.gulp.dest(dest));
			return stream;
		} catch (e) {
			console.warn('Unable to construct Gulp Stream', e);
			throw e;
		}
	}
	/** Parse SASS into CSS, append prefixes and minify (with sourcemap)
	    @param {Function} done Callback
	    @param {string} src Styles source path
	    @param {string} dest Styles destination path
	    @param {string} basename Stylesheet filename
        @param {boolean} dev If true (default), then Sourcemaps are written
	    @returns {Promise} Gulp promise
	    @see https://github.com/postcss/gulp-postcss
	    @see https://github.com/postcss/autoprefixer#options
	    @see https://scotch.io/tutorials/prevent-errors-from-crashing-gulp-watch#toc-prevent-errors-from-breaking-tasks
	*/
	buildStyles(done, src = GULPPATHS.styles.src, dest = GULPPATHS.server.dev + GULPPATHS.styles.dest, basename = 'icarus', dev = true) {
		return this.addEvents('BuildStyles', () => this.buildStylesStream(src, dest, basename, dev), done);
	}
	/** Creates CSS Dependencies from external
	    param {Function} done Callback
	    @param {string} dest Styles destination path
	    @param {string} filename Vendor file name
	    @returns {Promise} Gulp promise
	*/
	buildVendorStylesStream(dest = GULPPATHS.server.dev + GULPPATHS.styles.dest, filename = 'vendor') {
		let cdnUrl = 'https://cdnjs.cloudflare.com/ajax/libs';
		return merge(
				request(cdnUrl + '/twitter-bootstrap/3.3.7/css/bootstrap.min.css').pipe(source('bootstrap.css')),
				request(cdnUrl + '/animate.css/3.7.0/animate.min.css').pipe(source('animate.css'))
			)
			.pipe(this.pluginPlumber())
			.pipe(buffer())
			.pipe(concat(filename + '.css'))
			.pipe(this.gulp.dest(dest));
	}
	/** Creates CSS Dependencies from external
	    @param {Function} done Callback
	    @param {string} dest Styles destination path
	    @param {string} filename Vendor file name
	    @returns {Promise} Gulp promise
	*/
	buildVendorStyles(done, dest = GULPPATHS.server.dev + GULPPATHS.styles.dest, filename = 'vendor') {
		return this.addEvents('BuildVendorStyles', () => this.buildVendorStylesStream(dest, filename), done);
	}
	/** Retrieves font dependencies from external (CDN) and saves locally (src,dist)
	    @param {Function} done Callback
	    @returns {void} 
	    @see https://cdnjs.com/libraries/twitter-bootstrap/3.3.7
	*/
	buildVendorFonts(done) {
		try {
			let cdnUrl = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular';
			['eot', 'svg', 'ttf', 'woff', 'woff2'].forEach((filetype) => request(cdnUrl + '.' + filetype)
				.pipe(source('glyphicons-halflings-regular.' + filetype))
				.pipe(this.gulp.dest(GULPPATHS.server.dev + GULPPATHS.fonts.dest)));
			//});
			console.log(' - BuildVendorFonts: End');
			done();
		} catch (e) {
			console.warn('Unable to build Vendor Fonts', e);
			throw e;
		}
	}
	/** Creates a Pipe for Building Scripts
	    @param {string} src Source Path
        @param {string} dest Destination path
        @param {boolean} dev If true (default), then Sourcemaps are written
	    @returns {gulp.pipe.stream} A gulp 
	*/
	buildScriptsStream(src, dest, dev = true) {
		try {
			let stream = this.gulp.src(src, {
				base: GULPPATHS.scripts.base
			});
			stream = stream.pipe(this.pluginPlumber());
			stream = dev ? stream.pipe(sourcemaps.init()) : stream;
			stream = stream.pipe(terser());
			stream = dev ? stream.pipe(sourcemaps.write('.')) : stream;
			stream = stream.pipe(this.gulp.dest(dest));
			return stream;
		} catch (e) {
			console.warn('Unable to construct Gulp Stream', e);
			throw e;
		}
	}
	/** Terses Scripts and creates appropriate Sourcemaps
	    @param {Function} done Callback
	    @param {string} src Scripts source path
	    @param {string} dest Scripts destination path
        @param {boolean} dev If true (default) Sourcemaps are generated
	    @returns {Promise} Gulp promise
	*/
	buildScripts(done, src = GULPPATHS.scripts.src, dest = GULPPATHS.server.dev + GULPPATHS.scripts.dest, dev = true) {
		return this.addEvents('BuildScripts', () => this.buildScriptsStream(src, dest, dev), done);
	}
	/** Builds Vendor Scripts, Styles and Fonts
	    @returns {gulp.series} Series
	*/
	buildVendorAll() {
        return this.gulp.series(
            (done) => this.logCompletion('GULPFILE.buildVendorAll()', done),
            (done) => this.buildVendorScripts(done),
			(done) => this.buildVendorStyles(done),
			(done) => this.buildVendorFonts(done));
	}
	/** Builds a Stream that generates vendor Script files from public CDN's
	    @param {string} filename Output filename (will append .js)
	    @param {string} dest Output destination
        @returns {gulp.stream} Gulp Stream
	*/
	buildVendorScriptsStream(filename, dest) {
		try {
			return merge(
					request('https://code.jquery.com/jquery-3.3.1.min.js').pipe(source('jquery.js')),
					request('http://code.jquery.com/ui/1.12.1/jquery-ui.min.js').pipe(source('jqueryUI.js')),
					request('https://cdn.jsdelivr.net/npm/jquery-validation@1.17.0/dist/jquery.validate.min.js').pipe(source('jqueryValidate.js')),
					request('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js').pipe(source('bootstrap.js')))
				.pipe(this.pluginPlumber())
				.pipe(buffer())
				.pipe(concat(filename + '.js'))
				.pipe(this.gulp.dest(dest)); //, done);
		} catch (e) {
			console.warn('Unable to build Vendor Scripts Stream', e);
			throw e;
		}
	}
	/** Creates Javascript Dependencies inside Scripts/dist 
	    @param {Function} done Callback
	    @param {string} dest Destination Path
	    @param {string} filename Output name
	    @returns {Promise} Gulp promise
	*/
	buildVendorScripts(done, dest = GULPPATHS.server.dev + GULPPATHS.scripts.dest, filename = 'vendor') {
		return this.addEvents('BuildVendorScripts', () => this.buildVendorScriptsStream(filename, dest), done);
	}
	/** Deletes contents of SRC and TEST folders on the DEV Server
	    param {Function} done Callback
        @param {boolean} buildVendor If true, vendor Styles, Scripts and Fonts are rebuilt
	    @returns {void}
    */
    cleanDev(buildVendor = true) {
        return this.gulp.series(
            (done) => this.logCompletion('GULPFILE.cleanDev()', done),
            (done) => {
                del([
                    GULPPATHS.server.dev + GULPPATHS.scripts.dest,
                    GULPPATHS.server.dev + GULPPATHS.fonts.dest,
                    GULPPATHS.server.dev + GULPPATHS.styles.dest
                ], { force: true });
                done();
            },
            (done) => this.logCompletion('GULPFILE.buildVendor()', done),
            (done) => {
                if (buildVendor) {
                    try {
                        console.log('Building Vendor');
                        return this.buildVendorAll()(done);
                    } catch (e) {
                        console.warn('FAIL');
                        throw e;
                    }
                } else {
                    console.log('Not building Vendor');
                    done();
                }
            });
	}
	/** Post CSS Plugin with AutoPrefixer
	    @returns {postcss} A Post CSS Processing Plugin
	*/
	pluginPostCss() {
		return postcss([
			autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			}), postcsstouchcallout, postcssmomentumscrolling, postcssfontsmoothing
		]);
	}
}
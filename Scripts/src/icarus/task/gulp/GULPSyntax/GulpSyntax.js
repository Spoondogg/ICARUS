import GULPFILE, { GULPPATHS } from '../GULPFILE.js'; //del
import beautify from 'gulp-jsbeautifier';
import eslint from 'gulp-eslint';
//import sass from 'gulp-sass';
import sasslint from 'gulp-sass-lint';
//import sourcemaps from 'gulp-sourcemaps';
/** GulpFile that performs Linting and Beautification of Source Code and 
    - Audits Source code syntax
    - Transcodes Source to Distribution
    @class
    @extends GULPFILE
*/
export default class GulpSyntax extends GULPFILE {
	/** Beautifies Scripts and Styles 
	    @returns {gulp.series} Series
	*/
	beautifyAll() {
		return this.gulp.series(
			(done) => this.beautifyScripts(done),
			(done) => this.beautifyStyles(done));
	}
	/** Beautify the given Sass Stylesheet
	    @param {Function} done callback
	    @param {string} src Stylesheet Path
	    @returns {gulp.pipe} Gulp Pipe
	*/
	beautifyStyles(done, src = GULPPATHS.styles.src) {
		return this.addEvents('BeautifyStyles', () => this.beautifyStream(src), done);
	}
	/** Beautifies Source Documents
	    @param {string} src Styles source path
	    @returns {gulp} A gulp object
	*/
	beautifyStream(src) {
		try {
			return this.gulp.src(src, {
					base: './'
				})
				.pipe(beautify(require(GULPPATHS.config.beautify)))
				.pipe(this.gulp.dest('./'))
		} catch (e) {
			console.warn('Unable to create Beautify Stream', e);
			throw e;
		}
	}
	/** ES6 Beautification Pipe beautifies Script Files
	    @param {Function} done Callback
	    @param {string} src Scripts Path
	    @returns {Promise} Gulp promise
	*/
	beautifyScripts(done, src = GULPPATHS.scripts.src) {
		return this.addEvents('BeautifyScripts', () => this.beautifyStream(src), done);
	}
	/** Creates a Pipe for linting ES6
	    @param {string} src Source Path
	    @returns {gulp.series} A gulp 
	*/
	lintScriptsStream(src) {
		let stream = this.gulp.src(src);
		stream = stream.pipe(this.pluginPlumber());
		stream = stream.pipe(eslint(require(GULPPATHS.config.eslint)));
		stream = stream.pipe(eslint.format());
		return stream;
	}
	/** Lints given Script Files with ESLint
	    @param {Function} done callback
	    @param {string} label Script Label
	    @param {string} src Glob path
	    @returns {gulp.pipe} Gulp Pipe
	*/
	lintScripts(done, label, src) {
		return this.addEvents('LintScripts > ' + label, () => this.lintScriptsStream(src), done);
	}
	/** Lints Scripts and Styles 
	    @returns {gulp.series} Series 
	*/
	lintAll() {
		return this.gulp.series(
			(done) => this.lintScripts(done, 'Scripts', GULPPATHS.scripts.src),
			(done) => this.lintStyles(done),
			(done) => this.lintScripts(done, 'Tasks', GULPPATHS.tasks.src));
	}
	/** Performs linting on Sass Stylesheet
	    @param {string} src Path to Styles
	    @returns {gulp} A gulp object
	    @see https://github.com/sasstools/sass-lint/tree/master/docs/rules
	    @see https://github.com/sasstools/gulp-sass-lint/blob/master/tests/.sass-lint.yml
	    @see https://github.com/sasstools/gulp-sass-lint#optionsrules
	*/
	lintStylesPipe(src = GULPPATHS.styles.basefile) {
		return this.gulp.src(src)
			.pipe(sasslint(require(GULPPATHS.config.sasslint)))
			.pipe(sasslint.format())
			.pipe(sasslint.failOnError());
	}
	/** Performs linting of Stylesheets
	     @param {Function} done callback
	     @param {string} src Stylesheet Path
	     @returns {gulp.pipe} Gulp Pipe
	*/
	lintStyles(done, src = GULPPATHS.styles.basefile) {
		return this.addEvents('LintStyles', () => this.lintStylesPipe(src), done);
	}
}
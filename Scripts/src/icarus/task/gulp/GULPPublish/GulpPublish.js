import GULPFILE, { GULPPATHS, del } from '../GULPFILE.js';
import GulpBuild from '../GULPBuild/GulpBuild.js';
import GulpSyntax from '../GULPSyntax/GulpSyntax.js';
/** GulpFile that performs Publish tasks
    @class
    @extends GULPFILE
*/
export default class GulpPublish extends GULPFILE {
	constructor() {
		super();
		this.auditer = new GulpSyntax();
		this.builder = new GulpBuild();
	}
	/** Pipe that Copies contents of source to destination
	    @param {string} src Source Path
	    @param {string} dest Destination Path
	    @returns {gulp} A gulp promise
	*/
	publishStream(src, dest) {
		return this.gulp.src(src).pipe(this.gulp.dest(dest));
	}
	/** Copies contents of source to destination
	    @param {Function} done Callback
	    @param {string} label Label
	    @param {string} src Source Path
	    @param {string} dest Destination Path
	    @returns {gulp} A gulp promise
	*/
	publish(done, label, src, dest) {
		src.push('!**/deprec/**/**.*');
		src.push('!**/test/**/**.*');
		src.push('!**.(yml|md)');
		return this.addEvents('Publish > ' + label, () => this.publishStream(src, dest), done);
	}
	/** Publishes Distribution Scripts and Styles to the Production Server 
	    @param {Function} done Callback
	    @returns {gulp} A gulp series
	*/
	publishToProd() {
		return this.gulp.series(
			(done) => this.logEntryPoint('GulpPublish.publishToProd()', done),
			(done) => {
				del([GULPPATHS.server.prod + '**/*'], { force: true });
				done();
			},
			(done) => {
				this.gulp.src(['I://iis/dev/**/*', '!**.(yml|md)']).pipe(this.gulp.dest(GULPPATHS.server.prod));
				done();
			});
	}
	/** Lint, Build on Success, then Publish a DEV (default) version of the application Scripts
        @param {boolean} dev If true, sourcemaps and source files are deployed
        @param {string} src Source
        @param {string} dest Destination 
	    @returns {gulp.series} Series
	*/
	scripts_lintbuildpublish(dev = true, src = GULPPATHS.scripts.src, dest = GULPPATHS.server.dev + GULPPATHS.scripts.dest) { // 'Scripts'
		let profile = dev ? 'dev' : 'prod';
		return this.gulp.series(
			(done) => this.logCompletion('GulpPublish.scripts_lintbuildpublish(' + profile + ')', done),
			(done) => this.auditer.lintScripts(done, 'Scripts', src),
			(done) => this.builder.buildScripts(done),
			(done) => this.publish(done, 'PublishScripts', [GULPPATHS.scripts.baseglob], dest));
	}
	/** Lint, Build on Success, then publish a DEV (default) version of the application Styles
        @param {boolean} dev If true (default), then Sourcemaps are written
        @param {string} src Source
        @param {string} dest Destination
	    @returns {gulp.series} Series
	*/
	styles_lintbuildpublish(dev = true, src = GULPPATHS.styles.src, dest = GULPPATHS.styles.dest) {
		return this.gulp.series(
			(done) => this.logCompletion('GulpPublish.styles_lintbuildpublish()', done),
			(done) => this.auditer.lintStyles(done),
			(done) => this.builder.buildStyles(done, src, dest, 'icarus', dev),
			(done) => this.publish(done, 'PublishStyles', [GULPPATHS.styles.baseglob], GULPPATHS.server.dev + dest));
	}
}
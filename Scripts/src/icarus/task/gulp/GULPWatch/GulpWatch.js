import GULPFILE, { GULPPATHS } from '../GULPFILE.js';
import GulpPublish from '../GULPPublish/GulpPublish.js';
import GulpSyntax from '../GULPSyntax/GulpSyntax.js';
/** GulpFile that monitors files for changes and performs associated tasks
    @class
    @extends GULPFILE
*/
export default class GulpWatch extends GULPFILE {
	/** Watches the given path and performs the provided series on edit
	    @param {string} path Glob path
	    @param {gulp.series} series Gulp Series
	    @param {string} label Task Label
	    @returns {void}
	*/
	watchPath(path, series, label) {
		console.log('this.gulp.watch(' + label + ')', path);
		this.addEvents('Gulp.WatchPath', () => this.gulp.watch(path, series), null);
	}
	/** Performs watch tasks within a container that can be reset
	    @param {gulp} gulp A Gulp to be slurped
	    @see https://codepen.io/ScavaJripter/post/how-to-watch-the-same-gulpfile-js-with-gulp
	    @returns {void}
	*/
	slurp() {
		console.log('GULPFILE.slurp()');
		try {
			if (this.gulp.slurped) {
				console.log('GULPFILE: Already Slurped?');
			} else {
				// Modify
				let publisher = new GulpPublish();
				let auditer = new GulpSyntax();
				this.watchPath(GULPPATHS.scripts.baseglob, publisher.scripts_lintbuildpublish(), 'Scripts');
				this.watchPath(GULPPATHS.styles.basefile, publisher.styles_lintbuildpublish(), 'Styles');
				// Read Only
				this.watchPath(GULPPATHS.tasks.src, () => auditer.lintScripts(() => null, 'GulpTasks', GULPPATHS.tasks.src), 'Tasks');
				this.watchPath(GULPPATHS.tests.baseglob, () => auditer.lintScripts(() => null, 'MochaTests', GULPPATHS.tests.src), 'Tests');
				this.gulp.slurped = true;
				//console.log('GULPFILE: Slurped');
			}
		} catch (e) {
			this.logError('GULPFILE: Choked.  Slurp failed.', e);
		}
	}
	/** Looping watch that reloads when gulpfile is changed  
	    @returns {void}
	*/
	watch() {
		console.log('GULPFILE.watch()');
		this.slurp(this.gulp);
	}
}
import GULPFILE from '../GULPFILE.js'; //, { GULPPATHS, del }
/** GulpFile that performs Build tasks
    @class
    @extends GULPFILE
*/
export default class GulpBuild extends GULPFILE {
	/** Optimize images
	@see https://www.npmjs.com/package/gulp4#incremental-builds
	@returns {Promise} Gulp promise
	optimizeImages() {
	    return gulp.src(paths.images.src, { since: gulp.lastRun(images) })
	        .pipe(imagemin({ optimizationLevel: 5 }))
	        .pipe(gulp.dest(paths.images.dest));
	}*/
}
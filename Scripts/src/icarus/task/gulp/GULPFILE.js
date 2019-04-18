/** @module */
import { GULPPATHS } from './GULPPATHS.js';
import del from 'del';
import gulp from 'gulp4';
import gutil from 'gulp-util';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
/** Performs various Gulp Tasks
    @class
*/
export default class GULPFILE {
	/** Generic helper class for performing GULP Tasks */
	constructor() {
		this.gulp = gulp;
	}
	/** Appends Generic Error, Success and End Events for the given Pipe and passes done method where applicable
	     @param {string} label Pipe Label
	     @param {gulp.pipe} pipe Gulp Pipe
	     @param {Function} done callback
	     @returns {gulp.pipe} Gulp Pipe with Events
	*/
	addEvents(label, pipe, done) {
		try {
			return pipe()
				.on('error', (e) => this.logError(' - ' + label + ': Error', e, done))
                .on('success', () => console.log(' - ' + label + ': Success'), done)
                .on('finish', () => console.log(' - ' + label + ': Finish'), done)
				.on('end', () => this.logCompletion(' - ' + label + ': End', done));
		} catch (e) {
            console.warn('Unable to add Events to Stream: ' + label, e);
            done();
			throw e;
		}
	}
	/** Appends the given pipe to the stream
	    @param {gulp.pipe.stream} stream Gulp Stream
	    @param {gulp.pipe} pipe Gulp Pipe
        @returns {gulp.pipe.stream} Gulp Stream
	*/
	appendPipeToStream(stream, pipe) {
		return stream().pipe(pipe);
	}
	/** Error handling prevents gulp watch from stopping
	    @param {Error} err An error
	    @returns {void}
	    @see https://scotch.io/tutorials/prevent-errors-from-crashing-gulp-watch#toc-prevent-errors-from-breaking-tasks
	    @see https://stackoverflow.com/questions/43474288/gulp-4-keep-watching-even-on-error
	    @see https://cameronspear.com/blog/how-to-handle-gulp-watch-errors-with-plumber/
	*/
	onError(err) {
		notify.onError({
			title: "Gulp error in " + err.plugin,
			message: err.toString()
		})(err);
		gutil.beep();
	}
	/** Logs message to console and then performs callback
	    @param {string} msg Console message
	    @param {Function} done Done callback
	    @returns {void}
	*/
	logCompletion(msg, done = () => null) {
		console.log(msg);
		done();
	}
	/** Logs message to console and then performs callback
	    @param {string} label Console message
	    @param {Function} done Done callback
	    @returns {void}
	*/
	logEntryPoint(label, done) {
		return () => this.logCompletion('==============> ' + label, done);
	}
	/** Logs message and error to console and then performs callback
	    @param {string} msg Console message
	    @param {Error} e Error
	    @param {Function} done Done callback
	    @returns {void}
	*/
	logError(msg, e, done = () => false) {
		console.warn(msg, e);
		done();
	}
	/** Calls error handler when pipe fails
	    @returns {stream.Writable} A Writable Plugin 
	*/
	pluginPlumber() {
		return plumber({ errorHandler: this.onError });
	}
}
export { del, GULPPATHS }
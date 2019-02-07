import GULPFILE, { GULPPATHS, del } from '../GULPFILE.js';
import connect from 'connect';
import doxygen from 'doxygen';
import http from 'http';
import jsdoc from 'gulp-jsdoc3';
import sassdoc from 'sassdoc';
import servestatic from 'serve-static';
/** GulpFile that generates API, Script and Style Documentation
    @class
    @extends GULPFILE
*/
export default class GulpDocument extends GULPFILE {
	/** Generates JSDoc, SassDoc and API Documentation
        @param {doxygen} doxygen Doxygen Node Module
	    @returns {gulp.series} Series
	*/
	buildDocumentation() {
		return this.gulp.series(
			(done) => this.documentScripts(done),
			(done) => this.documentStyles(done),
			() => this.documentAPI(doxygen)
		);
	}
	/** Generate C# Documentation using Doxygen
	    @see https://stackoverflow.com/questions/36897877/gulp-error-the-following-tasks-did-not-complete-did-you-forget-to-signal-async
        param {doxygen} doxygen Doxygen Node Module
        @param {object} config Doxygen Config JSON
	    @returns {Promise} Async promise
	*/
	documentAPI(config = GULPPATHS.config.doxygen) {
		return new Promise((resolve, reject) => {
			try {
				//console.log('Promise documentAPI');
				doxygen.downloadVersion();
				//console.log('Promise documentAPI: Then');
				doxygen.createConfig(config, 'doxygen.config');
				//console.log('Promise documentAPI: Run');
				doxygen.run('doxygen.config');
				//console.log('GulpDocument.documentAPI(): Removing temp files...');
				del(['doxygen.config']);
				//console.log('GulpDocument.documentAPI(): Success');
				resolve();
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});
	}
	/** Document Client Side Scripts and Styles 
	    @returns {gulp.series} Series 
	*/
	documentClient() {
		return this.gulp.series(
			(done) => this.documentStyles(done),
			(done) => this.documentScripts(done)
		);
	}
	/** Generates Script documentation using JSDoc3
	    @param {Function} done Callback
        @param {string} src Scripts Source Path
        @param {string} config JSDoc Config JSON Path
	    @returns {Promise} Gulp promise
	*/
	documentScripts(done, src = GULPPATHS.scripts.src, config = '../../config/jsdoc.json') {
		return this.addEvents('DocumentScripts', () => this.gulp.src(src, {
			read: false
		}).pipe(jsdoc(require(config))), done); // MUST be string
	}
	/** Generates Style documentation using Sassdoc
	    @param {Function} done Callback
        @param {string} config SassDoc Config JSON Path
	    @returns {Promise} Gulp promise
	*/
	documentStyles(done, config = '../../config/sassdoc.json') {
		return this.addEvents('DocumentStyles',
			() => this.gulp.src(GULPPATHS.styles.src).pipe(sassdoc(require(config))), done);
	}
	/** Creates a static local server to host Documentation
        @param {number} port Server Port
	    @returns {Promise} Promise to create a server
	*/
	serveDocumentation(port = 9000) {
		return new Promise((resolve) => {
			console.log('GULPFILE.serveDocumentation(' + port + ')');
			let server = connect().use(servestatic('Documentation'));
			http.createServer(server).listen(port);
			resolve(server);
		});
	}
}
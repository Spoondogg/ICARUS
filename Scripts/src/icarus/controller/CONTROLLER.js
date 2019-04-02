/** @module */
import MAIN, { LOADER, MODEL } from '../model/el/container/main/MAIN.js';
import CONTAINERFACTORY from '../model/el/container/CONTAINERFACTORY.js';
import WATERMARK from '../helper/WATERMARK.js';
/** An Application Class
    @description Constructs the Application Controller and initializes the MAIN Container
    This should be instantiated during the init phase of the html document
    @class
    @extends MODEL
*/
export default class CONTROLLER extends MODEL {
	/** Constructs an Application
        @param {number} id The unique application id
        @param {string} user A friendly username
        @param {boolean} dev If true, dev-options are enabled
        @param {number} recursionLimit The maximum number of recursive loops before an error is thrown
        @param {string} name The application name
        @param {string} version The application version
        @param {string} token The session token
    */
	constructor(id = 0, user = 'Guest', dev = false, recursionLimit = 100, name, version, token) { // eslint-disable-line max-params
		super().set({
			id,
			user,
			dev,
			recursionLimit,
			name,
			version,
			token
		});
		document.body.className = "icarus";
		this.watermark = new WATERMARK();
		/** The Application LOADER */
		this.loader = new LOADER(0);
		this.loader.log(10, 'Launching App(' + id + ')');
		/** Retrieve the MAIN MODEL and instantiate MAIN Class */
		if (id >= 0) {
			$.getJSON('MAIN/GET/' + id, (payload) => {
				if (payload.result === 1) {
					/** The Application MAIN Container Class */
					this.main = new MAIN(payload.model, this.loader, new CONTAINERFACTORY());
					this.main.showLoginPrompt(user === 'Guest');
					this.keyBindings();
				} else {
					console.error(this.toString() + ' Unable to retrieve MAIN(' + id + ')');
				}
			});
		} else {
			console.error(this.toString() + ' Invalid Id to Load');
		}
	}
	debug() {
		console.log(this.toString() + '.debug()', this);
	}
	/** Sets application keybindings
	    @returns {void}
	    @see https://stackoverflow.com/a/14180949/722785
        @todo Consider if this should be abstracted to an interface
	*/
	keyBindings() {
		window.addEventListener('keydown', (event) => {
			if (event.ctrlKey || event.metaKey) {
				switch (String.fromCharCode(event.which).toLowerCase()) {
					case 's':
						event.preventDefault();
						console.log('ctrl-s', this.main.activeContainer);
						try {
							if (this.main.activeContainer.className === 'FORM') {
								this.main.activeContainer.post();
							}
						} catch (e) {
							console.log('Failed keyBinding', e);
						}
						break;
					case 'f':
						event.preventDefault();
						console.log('ctrl-f', this.main.activeContainer);
						break;
					case 'g':
						event.preventDefault();
						console.log('ctrl-g', this.main.activeContainer);
						break;
					default:
						//
				}
			}
		});
	}
}
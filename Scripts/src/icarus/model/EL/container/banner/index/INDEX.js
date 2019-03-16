/** @module  */
import PANEL, { CONTAINER, MODEL } from '../../../dialog/panel/PANEL.js';
import BANNER from '../BANNER.js';
import { ICONS } from '../../../../../enums/ICONS.js';
/** Contains a high level view of all objects owned by this user
    @class
    @extends BANNER
*/
export default class INDEX extends BANNER {
	/** Constructs an INDEX Container Element for browsing CONTAINERS
	    @param {CONTAINER} node Parent node
	    @param {MODEL} model INDEX model	    
    */
	constructor(node, model) {
		super(node, model);
		this.addClass('index');
		this.addContainersMenu();
		//this.navheader.expand();
    }
    constructElements() {
        console.log(this.className + '.constructElements()');
    }
	/** Adds the Containers Menu, a collection of Container Types that can be browsed
	    Adds a right aligned tab to show/hide the Container Menu
	    @throws Throws an error if this NAVHEADER is not a child of a valid CONTAINER or MODAL
	    @returns {void}
	*/
	addContainersMenu() {
		try {
			// Create Primary Options tab and Menu
			let btnContainers = this.navheader.tabs.addNavItemIcon(new MODEL().set({
				icon: ICONS.COG,
				label: 'ELEMENTS'
			}));
			let containerOptions = this.navheader.menus.addNavBar(new MODEL().set('name', 'ELEMENTS'));
			this.navheader.addTabbableElement(btnContainers, containerOptions);
			// Create Secondary Tabs and Horizontal Menus inside Menu
			let allowed = ['ARTICLE', 'FORM', 'JUMBOTRON', 'BANNER', 'CALLOUT', 'THUMBNAIL', 'CHAT', 'DICTIONARY', 'WORD', 'IMAGEGALLERY'];
			allowed.map((name) => {
				let tb = containerOptions.tabs.addNavItemIcon(new MODEL().set({
					label: name,
					icon: ICONS[name]
				}));
				let opt = containerOptions.menus.addMenu(new MODEL('horizontal').set('name', name));
				containerOptions.addTabbableElement(tb, opt);
				this.addThumbButtonActions(name, tb, opt);
				////  YOU SHOULD CREATE A TABBABLE ELEMENT (CONTAINER-PREVIEW) that can be populated with the element
			});
		} catch (e) {
			let modal = this.getProtoTypeByClass('MODAL');
			if (modal === null) {
				console.warn('Unable to retrieve MAIN Container', e);
				throw e;
			} else {
				switch (modal.className) {
					case 'LOADER':
					case 'PROMPT':
						break;
					default:
						console.warn(this.className + ' exists inside an unrecognized Modal window.', modal);
						break;
				}
			}
		}
    }
    /** If no children supplied...
	    @returns {Promise<ThisType>} Promise Chain
	*/
    ifEmpty() {
        return Promise.resolve(this);
    }
	/** Posts to the given element and retrieves a list of available instances, 
	    then assigns relevant actions to it
	    @param {string} element The name of the element 
	    @param {NAVITEMICON} thumb A NAVITEMICON that represents the given element
        @param {MENU} menu MENU relative to NAVITEMICON
	    @returns {void}
	    @async
	*/
	addThumbButtonActions(element, thumb, menu) {
		return new Promise((resolve, reject) => {
			try {
				$.post('/' + element + '/LIST', {
					'__RequestVerificationToken': this.getToken()
				}, (payload, status) => {
					if (status === 'success') {
						let str = 'There are ' + payload.list.length + ' instances of ' + payload.className;
						thumb.el.setAttribute('title', str);
						thumb.el.addEventListener('activate', () => console.warn('Payload for ' + element, payload));
						payload.list.forEach((li) => {
							let icon = menu.addNavItemIcon(new MODEL('card').set({
								label: li.id,
								icon: ICONS[element]
							}));
							icon.el.setAttribute('title', li.label);
							icon.el.addEventListener('activate', () => {
								let url = '/' + element + '/GET/' + li.id
								//console.warn('Output for ' + url, li);
								$.getJSON(url, (result) => {
									console.warn('Results for ' + url, result);
									let panel = new PANEL(new MODEL().set({
										label: url,
										caller: icon,
										container: this
									}));
									panel.body.addContainerCase(element);
									panel.body.populate([result.model]).then((results) => {
										try {
											results.body.pane.children[1].navheader.expand();
										} catch (e) {
											console.warn('Unable to show navheader.  Likely async issue', results);
										}
										// This is cheating.  You should be waiting for an indication that the CONTAINER has loaded instead of 
										// assuming that it will exist.  This will eventually break.
										setTimeout(() => {
											console.warn('!!! BAD BAD BADNESS !!! INDEX Populated', results, results.body.pane.children);
											// DO THE THING that you're not supposed to do this way
											results.body.pane.children[1].navheader.expand();
										}, 1000);
										panel.showDialog();
									});
								});
							})
						});
					}
					resolve(this);
				});
			} catch (e) {
				reject(e);
			}
		});
	}
	/** Creates a modal and loads the specified container
	    @param {number} delay Delay in milliseconds
	    param {string} title Modal Title
	    param {EL} node Modal node to append to
	    @param {string} className Object class name
	    @param {number} id Object id
	    @returns {void}
	*/
	launchPreview(delay = 500, className, id) { // title = 'Preview', // node
		setTimeout(() => {
			$.getJSON('/' + className + '/Get/' + id, (result) => {
				console.log(className, result);
				this.modal.container.preview.create(result.model);
			});
		}, delay);
		setTimeout(() => {
			$.getJSON('/' + className + '/GetContainerParents/' + id, (result) => {
				console.log(className + ' Parents:', result, result.length + ' parent Containers');
				this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
			});
		}, delay);
	}
}
export { CONTAINER }
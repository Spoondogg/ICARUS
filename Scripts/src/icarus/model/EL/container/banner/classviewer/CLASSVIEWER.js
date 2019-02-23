/** @module */
import FORM, { ATTRIBUTES, MODEL } from '../../../form/FORM.js';
import BANNER from '../BANNER.js';
import HEADER from '../../../header/HEADER.js';
//import MENU from '../../../nav/menu/MENU.js';
/** Contains a high level view of all MAIN Objects available to this user
    @class
    @extends BANNER
*/
export default class CLASSVIEWER extends BANNER {
	/** Constructs a CLASSVIEWER Container Element
	    @param {CONTAINER} node Parent node
	    @param {MODEL} model INDEX model
	*/
	constructor(node, model) {
		super(node, model);
		this.addClass('classviewer');
		this.classType = 'JUMBOTRON';
	}
	construct() {
        this.h1 = new HEADER(this.body.pane, new MODEL().set('innerHTML', this.classType + ' viewer'), 1);
		this.form = FORM.createEmptyForm(this.body.pane);
		let inputs = [
			new MODEL(new ATTRIBUTES({
				name: 'classType',
				value: this.classType,
				readonly: 'readonly'
			})).set({
				element: 'INPUT',
				label: 'Class Type'
			})
		];
		this.form.fieldset.formElementGroup.addInputElements(inputs);
		/* @todo Remove inline style and replace MENU from MENULIST
		this.menulist = new MENU(this.body.pane, new MODEL(new ATTRIBUTES('style', 'max-height:200px;overflow-y:auto;')).setGroup({
			name: 'preview-list',
			label: this.data.listClass + '(s)'
		}));
		let methods = ['Index', 'List', 'Count', 'Page', 'PageIndex', 'GetContainerParents'];
		for (let m = 0; m < methods.length; m++) {
			this.menulist.menu.addNavItem(new MODEL().set('label', this.classType + '.' + methods[m] + '()')).el.onclick = () => {
				window.open(new URL(window.location.href).origin + '/' + this.classType + '/' + methods[m]);
			};
        }
        */
	}
}
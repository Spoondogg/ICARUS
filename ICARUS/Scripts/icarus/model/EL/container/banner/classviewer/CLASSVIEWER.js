/**
    @module
*/
import BANNER from '../BANNER.js';
import CONTAINERFACTORY from '../../CONTAINERFACTORY.js';
import HEADER from '../../../header/HEADER.js';
import MODEL from '../../../../MODEL.js';
import ATTRIBUTES from '../../../../ATTRIBUTES.js';
import MENULIST from '../../menulist/MENULIST.js';

/**
    Contains a high level view of all MAIN Objects available to this user
    @class
    @extends BANNER
*/
export default class CLASSVIEWER extends BANNER {
    /**
        Constructs a CLASSVIEWER Container Element
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('classviewer');
        //this.populate(model.children);

        this.classType = 'JUMBOTRON';
        //this.classId = 3283;
    }

    construct() {
        if (!this.classType) {
            this.classType = 'JUMBOTRON';
        }

        this.h1 = new HEADER(this.body.pane, new MODEL().set({
            'label': this.classType + ' viewer'
        }), 1);

        this.form = CONTAINERFACTORY.createEmptyForm(this.body.pane);

        let inputs = [
            // SHOULD BE A SELECT
            new MODEL(new ATTRIBUTES({
                'name': 'classType',
                'value': this.classType,
                'readonly': 'readonly'
            })).set({
                'element': 'INPUT',
                'label': 'Class Type'
            })

        ];

        this.form.fieldset.formElementGroup.addInputElements(inputs);

        this.menulist = new MENULIST(
            this.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'style': 'max-height:200px;overflow-y:auto;'
                })
            ).set({
                'name': 'preview-list',
                'label': this.data.listClass + '(s)'
            }));

        let methods = ['Index', 'List', 'Count', 'Page', 'PageIndex', 'GetContainerParents'];
        for (let m = 0; m < methods.length; m++) {
            this.menulist.menu.addNavItem(new MODEL().set({
                'label': this.classType + '.'+methods[m]+'()'
            })).el.onclick = function () {
                window.open(new URL(window.location.href).origin + '/' + this.classType + '/'+methods[m]);
            }.bind(this);
        }
    }
}
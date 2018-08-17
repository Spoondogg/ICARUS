/**
 * A vertical navitemgroup with a search panel
 */
class SIDEBAR extends EL { // NAVBAR

    /**
        A Sidebar element
        @param {MAIN} node The CONTAINERBODY to contain the sidebar
        @param {MODEL} model The text that is displayed within the footer
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('sidebar'); //active
        //    height: calc(100% - 104px);

        /*
        this.form = this.createEmptyForm(this, false);

        let inputs = [
            new MODEL(new ATTRIBUTES({
                'name': 'element',
                'value': this.get('element'),
                'readonly': 'readonly'
            })).set({
                'element': 'INPUT',
                'label': 'element'
            }),

            new MODEL(new ATTRIBUTES({
                'id': 0,
                'name': 'id',
                'value': new String(this.get('id')),
                'readonly': 'readonly'
            })).set({
                'element': 'INPUT',
                'label': 'ID'
            }),

            // Should be checkbox or dropdown
            new MODEL(new ATTRIBUTES({
                'name': 'status',
                'type': 'NUMBER',
                'value': new String(this.get('status'))
            })).set({
                'element': 'INPUT',
                'label': 'Status',
                'addTab': 0
            })

            
        ];

        this.form.fieldset.formElementGroup.addInputElements(inputs);

        this.form.setPostUrl(this.className + '/Set');
        */

    }   

    //construct() {    }

}
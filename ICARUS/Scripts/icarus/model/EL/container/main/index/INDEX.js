/**
    Contains a high level view of all objects owned by this user
*/
class INDEX extends CONTAINER {
    /**
        Constructs a SECTION Container Element
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
     */
    constructor(node, model) {
        super(node, 'DIV', model, []);
        //this.addContainerCase('FORM');
        //this.populate(model.children);
    }

    construct() {
        let elementList = ['Main', 'Article', 'Form'];

        this.list = new LIST(this.body.pane, new MODEL());

        for (let l = 0; l < elementList.length; l++) {

            //this.list.create(new LISTITEM(this.list.body.pane, 

            let group = new GROUP(this.list, 'LI', new MODEL().set({
                'name': elementList[l]
            }));

            group.setInnerHTML(elementList[l] + ': 0');            

            this.list.addGroup(group);
        }
        //this.preview
    }
}
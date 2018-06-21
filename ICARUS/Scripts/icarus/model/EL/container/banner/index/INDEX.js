/**
    Contains a high level view of all objects owned by this user
*/
class INDEX extends BANNER {
    /**
        Constructs a SECTION Container Element
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
     */
    constructor(node, model) {
        super(node, model);
        //this.populate(model.children);
    }

    construct() {
        let elementList = ['Article', 'Form', 'JUMBOTRON', 'BANNER', 'CALLOUT', 'THUMBNAIL']; //'Main',

        //this.list = new LIST(this.body.pane, new MODEL());

        //let list = 0;
        for (let l = 0; l < elementList.length; l++) {

            /*
            let group = new GROUP(this.list, 'LI', new MODEL().set({
                'name': elementList[l]
            }));
            this.list.addGroup(group);
            */
            let thumb = new INDEXTHUMBNAIL(this.body.pane, new MODEL().set({
                'label': elementList[l],
                'dataId': -1,
                'data': {
                    'header': elementList[l],
                    'p': '&nbsp;'
                }
            }));

           // list = 0;
            $.post('/' + elementList[l] + '/List', {
                '__RequestVerificationToken': token.value
            },
                function (payload, status) {
                    if (status === 'success') {
                        thumb.data.p = 'There are ' + payload.list.length + ' instances of ' + payload.className;
                        thumb.p.setInnerHTML(thumb.data.p);                   
                        thumb.data.listClass = payload.className;
                        thumb.data.list = payload.list;
                    }                    
                }.bind(this)
            );
        }
        //this.preview
    }
}
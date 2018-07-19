/**
    Contains a high level view of all MAIN Objects available to this user
*/
class CLASSVIEWER extends BANNER {
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

        this.form = this.createEmptyForm(this.body.pane);

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
        

        /*
        this.form.afterSuccessfulPost = function () {
            $(node.el).collapse('toggle');
            node.empty();
            this.setLabel(form.el.elements['label'].value);
            if (caller) {
                caller.toggle('active');
                console.log(caller);
                caller.node.node.toggleCollapse();
            }
            app.loader.hide();
        }.bind(this);
        */


        /*
        $.post('/Main/PageIndex?page=' + this.page + '&pageLength=' + this.pageLength, {
            '__RequestVerificationToken': token.value
        },
            function (payload, status) {
                if (status === 'success') {

                    this.pageTotal = payload.total;
                    for (let l = 0; l < payload.list.length; l++) {
                        let thumb = new THUMBNAIL(this.body.pane, new MODEL().set({
                            'label': payload.list[l].label,
                            'dataId': -1,
                            'data': {
                                'header': payload.list[l].label,
                                'p': 'Launch ' + payload.list[l].label + ' (' + payload.list[l].id + ')<br>'
                                    + payload.className + '[' + payload.list[l].index + ']'
                            }
                        }));
                        thumb.image.el.setAttribute('style', 'display:none;');

                        thumb.button.el.onclick = function() {
                            this.launchMain(payload.list[l].id);
                        }.bind(this);
                    }



                    if (!this.pagination.buttonGroup.loaded) {
                        console.log('Page Total: ' + this.pageTotal + ', Length: ' + this.pageLength);
                        this.pageCount = Math.ceil(this.pageTotal / this.pageLength);
                        console.log('PageCount: ' + this.pageCount + ', (' + this.pageTotal / this.pageLength + ')');
                        for (let p = 0; p < this.pageCount; p++) {
                            let btn = this.pagination.buttonGroup.addButton(p + 1);
                            btn.el.onclick = function () {
                                this.loadPage(p);
                            }.bind(this);
                        }
                        this.pagination.buttonGroup.loaded = true;
                    }

                    
                }                    
            }.bind(this)
        );
        */
    }
}
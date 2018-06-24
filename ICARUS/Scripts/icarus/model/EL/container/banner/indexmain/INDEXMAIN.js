/**
    Contains a high level view of all MAIN Objects available to this user
*/
class INDEXMAIN extends BANNER {
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
            
        $.post('/Main/List', {
            '__RequestVerificationToken': token.value
        },
            function (payload, status) {
                if (status === 'success') {

                    for (let l = 0; l < payload.list.length; l++) {
                        let thumb = new THUMBNAIL(this.body.pane, new MODEL().set({
                            'label': payload.list[l].label,
                            'dataId': -1,
                            'data': {
                                'header': payload.list[l].label,
                                'p': 'Launch ' + payload.list[l].label
                            }
                        }));
                        thumb.button.el.onclick = function () {

                            let targetId = payload.list[l].id;
                            let url = new URL(window.location.href);
                            console.log(url);
                            console.log('Url Origin: ' + url.origin);
                            window.open(url.origin + '/' + targetId);
                            /*
                            let returnUrl = url.searchParams.get('ReturnUrl');
                            if (returnUrl) {
                                returnUrl = url.origin + returnUrl;
                                location.href = returnUrl;
                            } else {
                                location.reload(true);
                            }
                            */
                        }
                    }

                    //thumb.data.p = 'There are ' + payload.list.length + ' instances of ' + payload.className;
                    //thumb.p.setInnerHTML(thumb.data.p);                   
                    //thumb.data.listClass = payload.className;
                    //thumb.data.list = payload.list;
                }                    
            }.bind(this)
        );
    }
}
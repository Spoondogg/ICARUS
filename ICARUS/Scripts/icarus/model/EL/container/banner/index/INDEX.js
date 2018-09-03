/**
    Contains a high level view of all objects owned by this user
*/
import { BANNER } from '../BANNER.js';
import { HEADER } from '../../../header/HEADER.js';
import { NAVITEMICON } from '../../../nav/navitemicon/NAVITEMICON.js';
export class INDEX extends BANNER {
    /**
        Constructs a SECTION Container Element
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('index');
        //this.populate(model.children);
    }

    construct() {
        this.containerHeader = new HEADER(this.body.pane, new MODEL().set({
            'label': 'INDEX'
        }));
        //$(this.containerHeader.el).insertBefore(this.body.pane);

        let elementList = ['ARTICLE', 'Form', 'JUMBOTRON', 'BANNER', 'CALLOUT', 'THUMBNAIL', 'CHAT', 'DICTIONARY', 'WORD', 'IMAGEGALLERY']; //'Main',

        app.loader.log('Constructing Container Index...');

        for (let l = 0; l < elementList.length; l++) {

            let thumb = new NAVITEMICON(this.body.pane, new MODEL().set({
                'anchor': new MODEL().set({
                    'icon': ICONS[elementList[l].toUpperCase()],
                    'label': elementList[l],
                    'dataId': -1,
                    'data': {
                        'header': elementList[l],
                        'p': '&nbsp;'
                    }
                })
            }));
            /*
            let thumb = new INDEXTHUMBNAIL(this.body.pane, new MODEL().set({
                'label': elementList[l],
                'dataId': -1,
                'data': {
                    'header': elementList[l],
                    'p': '&nbsp;'
                }
            }));
            */

            //app.loader.log(100, 'Retrieving ' + elementList[l] + '...', true);


           // list = 0;
            $.post('/' + elementList[l] + '/List', {
                '__RequestVerificationToken': token.value
            },
                function (payload, status) {
                    if (status === 'success') {
                        //thumb.data.el.setAttribute('title', 'There are ' + payload.list.length
                        //    + ' instances of ' + payload.className);
                        //thumb.data.listClass = payload.className;
                        //thumb.data.list = payload.list;
                        let str = 'There are ' + payload.list.length + ' instances of ' + payload.className;
                        thumb.el.setAttribute('title', str);
                        thumb.el.onclick = function () {
                            this.launchModal(
                                payload.className,
                                str,
                                payload.className,
                                payload.list
                            );
                        }.bind(this);
                        /*
                        thumb.data.p = 'There are ' + payload.list.length
                            + ' instances of ' + payload.className;
                        thumb.p.setInnerHTML(thumb.data.p);     
                        thumb.data.listClass = payload.className;
                        thumb.data.list = payload.list;
                        */


                    }                    
                }.bind(this)
            );
        }

        //app.loader.hide(500);
    }

    /**
     * Creates the Modal that contains the list of objects for preview
     * TODO: Consider paging these results
     * @param {string} header Header text
     * @param {string} p paragraph
     * @param {string} listClass element class
     * @param {Array} list A list
     */
    launchModal(header, p, listClass, list) {
        debug('Launch Index Thumbnail Modal');
        app.loader.log(100, 'Launching Modal', true);

        this.modal = new MODAL(header);
        this.modal.container.body.pane.addClass('thumbnail index-thumbnail');

        //this.modal.container.image = new IMG(this.modal.container.body.pane, new MODEL());
        //this.modal.container.image.el.src = this.image.el.src;

        this.modal.container.header = new HEADER(this.modal.container.body.pane,
            new MODEL().set({
            'label': header
        }));

        this.modal.container.p = new P(this.modal.container.body.pane,
            new MODEL(new ATTRIBUTES({
            'style': 'height:auto;'
        })), p);

        this.modal.container.previewNotes = new EL(this.modal.container.body.pane,
            'DIV', new MODEL(new ATTRIBUTES({
            'class': 'preview-notes'
        })), '');

        this.modal.container.preview = new CONTAINER(
            this.modal.container.body.pane, 'DIV',
            new MODEL(new ATTRIBUTES('preview')),
            [listClass.toUpperCase()]
        );

        this.modal.container.preview.el.setAttribute(
            'style', 'height:400px;max-height:400px;overflow-y:auto;'
        );

        this.modal.container.menulist = new MENULIST(
            this.modal.container.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'style': 'max-height:200px;overflow-y:auto;'
                })
            ).set({
                'name': 'preview-list',
                'label': listClass + '(s)'
            }));


        for (let li = 0; li < list.length; li++) {

            let title = list[li].label + ' (' + listClass + '[' + list[li].id + '])';

            this.modal.container.menulist.menu.addNavItem(new MODEL().set({
                'label': title
            })).el.onclick = function () {
                this.modal.container.preview.body.pane.empty();

                this.launchPreview(
                    500, title,
                    this.modal.container.preview.body.pane,
                    listClass,
                    list[li].id
                );
            }.bind(this);

        }
        this.modal.show();
    }

    /**
     * Creates a modal and loads the specified container
     * @param {number} delay Delay in milliseconds
     * @param {string} title Modal Title
     * @param {EL} node Modal node to append to
     * @param {string} className Object class name
     * @param {number} id Object id
     */
    launchPreview(delay = 500, title = 'Preview', node, className, id) {
        app.loader.log(100, 'Launch Preview', true);
        setTimeout(function () {
            $.getJSON('/' + className + '/Get/' + id, function (result) {
                console.log(className + ':');
                console.log(result);
                this.modal.container.preview.create(result.model);
            }.bind(this));
        }.bind(this), delay);

        // Get a list of Parents for this Container
        // TODO: Do something with this, please!
        setTimeout(function () {
            $.getJSON('/' + className + '/GetContainerParents/' + id, function (result) {
                console.log(className + ' Parents:');
                console.log(result);
                console.log(result.length + ' parent Containers');
                //this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
                this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
            }.bind(this));
        }.bind(this), delay);
    }
}
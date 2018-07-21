﻿/**
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
        this.addClass('index-main');
        //this.populate(model.children);

        this.page = 0;
        this.pageLength = 6;
        this.pageTotal = 0;

        //if (this.dataId > 0) {    }

        this.header = new HEADER(this, new MODEL());
        $(this.header.el).insertBefore(this.body.pane.el);

        this.pagination = new FOOTER(this, new MODEL('pagination'));
        this.pagination.el.setAttribute('style', 'text-align:center;');
        $(this.pagination.el).insertBefore(this.body.pane.el);

        this.pagination.btnPrev = new BUTTON(this.pagination, 'Prev');
        this.pagination.btnPrev.el.setAttribute('style', 'margin-right:1em;');
        this.pagination.btnPrev.el.onclick = this.prevPage.bind(this);

        this.pagination.buttonGroup = new BUTTONGROUP(this.pagination);
        this.pagination.buttonGroup.loaded = false;

        this.pagination.btnNext = new BUTTON(this.pagination, 'Next');
        this.pagination.btnNext.el.setAttribute('style', 'margin-left:1em;');
        this.pagination.btnNext.el.onclick = this.nextPage.bind(this);


        this.footer = new FOOTER(this, new MODEL());
        $(this.pagination.el).insertAfter(this.body.pane.el);


        this.loadPage(this.page);
    }

    construct() {
        if (!isNaN(this.page)) {

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

                            thumb.button.el.onclick = function () {
                                this.launchMain(payload.list[l].id, payload.list[l].label);
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
        } else {
            let note = new P(this.body.pane, new MODEL(), 'No Containers Exist');
        }
    }

    loadPage(page) {
        console.log('Loading page ' + page);
        try {
            this.header.setInnerHTML('Page ' + (page + 1));

            let buttons = this.pagination.buttonGroup.el.children;
            for (let b = 0; b < buttons.length; b++) {
                $(buttons[b]).removeClass('active');
            }
            //console.log('Activating button[' + page + ']');
            $(buttons[page]).addClass('active');

            this.body.pane.empty();
            this.page = page;
            this.construct();
            ///this.body.pane.el.setAttribute('style', 'height:auto;');
        } catch (e) {
            console.log('Unable to load page.');
            console.log(e);
        }
        
    }

    nextPage() {
        if (this.pageTotal > this.page * this.pageLength + 1) {
            this.loadPage(this.page + 1);
        } else {
            console.log('No next pages to display');
        }
    }

    prevPage() {
        if (this.page > 0) {
            this.loadPage(this.page - 1);
        } else {
            console.log('No previous pages to display');
        }
    }



    /**
     * Opens the given Main Id in a new window
     * @param {number} id Main Container Id
     * @param {string} label Main Container Label
     */
    launchMain(id, label) {
        //window.open(new URL(window.location.href).origin + '/' + id);

        // Try opening an IFRAME Modal instead
        debug('Launch Index IFrame Modal');

        this.modal = new MODAL(label);
        this.iframe = new IFRAME(this.modal.container.body.pane, new MODEL().set({
            'label': 'iframe',
            'dataId': -1,
            'data': {
                'src': url.origin + '/' + id
            }
        }));
        this.iframe.frame.el.setAttribute('src', url.origin + '/' + id);

        this.modal.show();
    }




    /**
     * Creates the Modal that contains an iFrame with the given page loaded
     * TODO: Consider paging these results
     */
    launchModal() {
        debug('Launch Index IFrame Modal');

        this.modal = new MODAL(this.data.header);
        this.iframe = new IFRAME(this.modal.container.body.pane, new MODEL().set({
            'label':'iframe'
        }));


        this.modal.show();
    }


}
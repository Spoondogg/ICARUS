000000import BANNER from '../BANNER.js';
/**
    Contains a high level view of all objects owned by this user
*/
export default class IMAGEGALLERY extends BANNER {
    /**
        Constructs a SECTION Container Element
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('image-gallery');
        //this.populate(model.children);

        this.page = 0;
        this.pageLength = 6;
        this.pageTotal = 0;

        if (this.dataId > 0) {
            //
        }

        this.header = new HEADER(this, new MODEL().set({
            'label': 'Image Gallery'
        }));
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
        console.log('Constructing imagegallery');
        let postUrl = '/ImageGallery/ImageIndex';
        if (this.page) {
            postUrl += '?page=' + this.page + '&pageLength=' + this.pageLength;
        }
        $.post(postUrl, {
            '__RequestVerificationToken': token.value
        },

            /**
                Processes the payload from /ImageGallery/ImageIndex?page=X&pageLenght=Y
                @param {any} payload The POST payload
                @param {any} status The POST status
            */
            function (payload, status) {
                if (status === 'success') {

                    console.log('IMAGEGALLERY PAYLOAD:');
                    console.log(payload);

                    this.pageTotal = payload.total;
                    for (let l = 0; l < payload.list.length; l++) {
                        //console.log(payload.list[l]);
                        let thumb = new THUMBNAIL(this.body.pane, new MODEL().set({
                            'label': payload.list[l].label,
                            'dataId': -1,
                            'data': {
                                'header': payload.list[l].label,
                                'p': 'Launch ' + payload.list[l].label + ' (' + payload.list[l].id + ')<br>'
                                    + payload.className + '[' + payload.list[l].index + ']',
                                'img': payload.list[l].id,
                                'showImageDetails': true
                            }
                        }));

                        if (payload.list[l].id === 0) {
                            thumb.image.el.setAttribute('style', 'display:none;');
                        }

                        thumb.button.el.onclick = function () {
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
    }

    /**
        Sets the page variables and reconstructs
        @param {any} page A page to load
    */
    loadPage(page) {
        console.log('Loading page ' + page);
        this.header.setInnerHTML('Page ' + (page + 1));

        let buttons = this.pagination.buttonGroup.el.children;
        for (let b = 0; b < buttons.length; b++) {
            $(buttons[b]).removeClass('active');
        }
        $(buttons[page]).addClass('active');

        this.body.pane.empty();
        this.page = page;
        this.construct();
    }

    /**
        Loads the next page
    */
    nextPage() {
        if (this.pageTotal > this.page * this.pageLength + 1) {
            this.loadPage(this.page + 1);
        } else {
            console.log('No next pages to display');
        }
    }

    /**
        Loads the previous page
    */
    prevPage() {
        if (this.page > 0) {
            this.loadPage(this.page - 1);
        } else {
            console.log('No previous pages to display');
        }
    }



    /**
     * Opens the given Image FormPost in a new window
     * @param {number} id Main Container Id
     */
    launchMain(id) {
        window.open(new URL(window.location.href).origin + '/FormPost/Get/' + id);
    }
}
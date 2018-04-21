/**
 * A vertical navitemgroup with a search panel
 */
class SIDEBAR extends MENU { // NAVBAR

    /**
        A vertical navitemgroup with a search panel
        @param {CONTAINERBODY} node The CONTAINERBODY to contain the sidebar
        @param {MODEL} model The text that is displayed within the footer
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('sidebar navbar-inverse collapse'); //active

        this.search = new NAVSEARCH(this);
        this.search.el.style.display = 'none'; // TODO: Search isn't necessary just yet
        
        this.search.inputGroup.q.el.onkeypress = function () {
            this.menu.addClass('in');
        }.bind(this);

        this.toggleButton = new NAVITEM(this, new MODEL(new ATTRIBUTES('toggle')).set({
            'anchor': new MODEL().set({
                'label': '<span class="caret"></span>'
            })
        }));
        this.toggleButton.anchor.addClass('toggle-wide noselect');

        this.toggleButton.el.onclick = this.toggleDocumentMap.bind(this);

        this.menu = new MENU(this, new MODEL('collapse in').set({
            'name': 'document-map'
        }));
    }

    /**
        Show / Hide the Document Map Menu
     */
    toggleDocumentMap() {
        //this.menu.toggle('in');
        $(this.menu.el).collapse('toggle');
    }    
}
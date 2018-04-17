/**
 * A vertical navitemgroup with a search panel
 */
class SIDEBAR extends NAVITEMGROUP { // NAVBAR

    /**
        A vertical navitemgroup with a search panel
        @param {CONTAINERBODY} node The CONTAINERBODY to contain the sidebar
        @param {MODEL} model The text that is displayed within the footer
     */
    constructor(node, model) {
        super(node, model);
        //this.header.hide();
        this.addClass('sidebar navbar-inverse'); //active

        this.search = new NAVSEARCH(this);
        
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

        this.menu = this.addNavBarCollapse(
            new MODEL('in').set({
                'name': 'document-map',
                'label': 'Sidebar Menu'
            })
        );
    }

    /**
        Show / Hide the Document Map Menu
     */
    toggleDocumentMap() {
        //this.menu.toggle('in');
        $(this.menu.el).collapse('toggle');
    }
    
}
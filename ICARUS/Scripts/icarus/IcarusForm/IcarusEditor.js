/**
    Replaces the default MVC Edit page with something a little more JavaScript oriented
    @param {object} node The object that this editor is appended to
    @param {string} url The url for the previous list
*/
class IcarusEditor {
    constructor(node, url) {
        this.header = new EL(node, 'H2', {}, 'Edit Form Element (icarusEditor)');

        this.form = new IcarusForm(node, {
            'action': url, 'method': 'post'
        }, '/Form/Submit', '#?a=1');

        this.footer = new EL(node, 'h4');
        this.footer.btnBack = new EL(this.footer, 'a', { 'href': url }, 'Back to List');
    }
}

/**
    Replaces the default MVC Edit page with something a little more JavaScript oriented
    @param {object} node The object that this editor is appended to
    @param {string} url The url for the previous list
*/
class IcarusFormEditor {
    constructor(node, url) {
        this.header = new HEADER(node, "Edit Form (icarusFormEditor)", 2);
        this.header.el.onclick = function () {
            alert('woot');
        };
    }
}
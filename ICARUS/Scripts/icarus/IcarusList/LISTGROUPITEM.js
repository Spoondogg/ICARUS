/**
    A bootstrap list-group-item with the option of adding a badge
    @param {object} node The object to contain this element
    @param {object} attributes Element attributes
    @param {string} innerHtml The html to add
    @param {string} label Text to display in a badge
*/
class LISTGROUPITEM extends LI {
    constructor(node, attributes, innerHtml, label) {
        super(node, attributes, innerHtml);
        this.el.className = 'list-group-item noselect clickable';

        // If the badge text was supplied as an argument, create the badge
        if (label) {
            this.addBadge(label);
        }

        // When the list-item is clicked...  This should actually be set on the sub-class
        this.el.onclick = function () {
            alert('click!');
        };
    }

    /**
        Adds a badge to the list item
        @param {string} label The label inside this badgeLIS
    */
    addBadge(label) {
        this.badge = new BADGE(this, label);
    }
}
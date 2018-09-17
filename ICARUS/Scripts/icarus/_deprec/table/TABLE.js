/** 
    TABLE()
    An HTML5 document JavaScript HTML5 Table Object Constructor
    using Bootstrap 3 and JQuery
    @param {EL} node The object to contain the table
    @param {array} columns A sorted list of columns
*/
const TABLE = function (node, columns) {
    // Construct the <TABLE> element
    EL.call(this, node, 'table', {
        'id': 'tbl' + document.getElementsByTagName('table').length,
        'class': 'table-fixed'
    });

    // Unique identifier for this table
    this.id = 'tbl' + document.getElementsByTagName('table').length;

    // A sorted array (list) of columns for the table
    this.columns = columns;

    // Valid Table groupings include <thead>, <tbody> and <tfoot>.
    this.addGroup = function (group) {
        this.el[group] = new EL(this.el, group);
        this.el[group].rows = [];
        //this.table.addRow()
    };

    // Construct the initial groups for this table
    this.groups = ['thead', 'tbody', 'tfoot'];
    for (let g = 0; g < this.groups.length; g++) {
        this.addGroup(this.groups[g]);
    }

    // Removes all elements / array objects from group
    this.emptyGroup = function (group) {
        this.el[group].rows.length = 0;
        this.el[group].empty();
    };

    // Creates a row and appends to group
    this.addRow = function (group) {
        var row = new EL(this.el[group].el, 'tr');
        row.columns = [];
        this.el[group].rows.push(row);
    };

    // Creates a column and appends to group/row
    this.addColumn = function (group, row, colObj) {
        var r = this.el[group].rows[row];
        var type = group === 'THEAD' ? 'th' : 'td';
        r.columns.push(new EL(r.el, type, colObj));
    };

};
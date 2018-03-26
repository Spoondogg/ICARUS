/**
    Iterate through pages of data
    @param {object} parentObj The element that will contain this object
    @param {number} range Limits the amount of records returned
    @param {string} align Left|Center|Right
*/
class PAGINATION {

    constructor(parentObj, range, align) {
        // http://stackoverflow.com/questions/109232/what-is-the-best-way-to-paginate-results-in-sql-server
        align = align === undefined ? 'center' : align;
        this.pagination = new EL(parentObj, 'div', { 'style': 'text-align:' + align });
        this.list = new EL(this.pagination, 'ul', { 'class': 'pagination' }); // TODO: use UL
        this.pages = [];
        this.range = range;
    }

    addPage(label) {
        label = label ? label : this.pages.length + 1;
        this.page = new EL(this.list, 'LI');
        this.page.a = new EL(this.page, 'a', { 'href': '#' }, label);
        if (parseInt(label) > 0) {
            this.pages.push(this.page);
        }
    }
}
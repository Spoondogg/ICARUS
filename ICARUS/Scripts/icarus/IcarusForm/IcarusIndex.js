/**
    A visual representation of an ordered array.

    A dropdown filter that can be added to an index page to specify the category
    This object filters contents within an IcarusInputList.

    @author ryan@spoonmedia.ca

    @param {EL} node The parent object
    @param {string} categoryElementRoute The url that is posted to
    @param {number} currentId The Id of the index filter
*/
class IcarusIndex {
    constructor(node, categoryElementRoute, currentId) {
        console.log('Constructing index filter: ' + currentId);
        this.filterInput = new EL(node, 'SELECT', {
            'id': 'indexFilter',
            'name': 'indexFilter',
            'class': 'form-control',
            'style': 'width:160px !important;'
        });
        this.filterInput.el.onchange = function () {
            console.log('Changed index filter...');
            window.location.href = this.value;
        };

        // Get all categories and set current Id to selected value
        getCategories(0, currentId);
    }

    /**
        Adds a category to the drop down.

        @param {string} label Text
        @param {string} value Value
        @param {number} currentId The selected category id
    */
    addCategory(label, value, currentId) {
        console.log('addCategory: ' + currentId);
        let category = new EL(filterInput.el, 'option', { 'value': value }, label);
        if (currentId === parseInt(value)) {
            category.el.setAttribute('selected', 'selected');
        }
    }

    /**
        Retrieve each category and add it to the category filter.

        @param {number} categoryId Category Id
        @param {number} currentId Current Id
    */
    getCategories(categoryId, currentId) {
        console.log('Called getCategories(' + categoryId + ');');
        let dataToBeSent = {};
        $.post(categoryElementRoute + '/' + categoryId, dataToBeSent,
            function (formCategoryData, textStatus) {

                let myElements = [];

                // textStatus contains the status: success, error, etc
                // If server responds with 'success'
                if (textStatus === "success") {
                    console.log('Constructing form category list...');

                    // Now add each item to the list
                    addCategory('Show All', 0, currentId);
                    for (i = 0; i < formCategoryData.length; i++) {
                        addCategory(formCategoryData[i].label, formCategoryData[i].id, currentId);
                    }

                } else {
                    console.log('Failed to retrieve form category from server with status: "' + textStatus + '"');
                }
            }, "json"
        );
    }
}
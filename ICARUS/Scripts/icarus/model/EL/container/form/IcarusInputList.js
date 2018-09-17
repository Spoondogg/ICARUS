/**
    @module
*/
import EL from '../../EL.js';

/**
    The IcarusInputList populates two columns with a set of values based on a delimited list.
    The left column contains values that are currently not stored in the parent object, while
    the right column contains values that are referenced by the parent.

    The user can move objects from the left column to the right, as well as sort the order
    of these objects, affecting the order in which they are constructed within the parent

    @class
*/
export default class IcarusInputList {
    /**
        Constructs an Input List
        @param {EL} node The object that contains constructed results
        @param {string} myValue A comma delimited string of values
        @param {string} postElementRoute The url that values are posted to
        @param {string} objectLabel The label that represents this object
        @param {string} objectIdName The id/name used for this input
        @param {string} editPath The url path for editing this object
        @param {string} categoryElementRoute The url that can be posted to in order to retrieve categoryElements
     */
    constructor(node, myValue, postElementRoute, objectLabel, objectIdName, editPath, categoryElementRoute) {
        let myValueArray = myValue.split(',');

        // Construct the Group Selector in the sandbox
        let sandbox = document.getElementById('sandbox'); // parentObj

        //var label = new EL(sandbox, 'label', { 'class': 'control-label' }, objectLabel);
        let label = new LABEL(sandbox, objectLabel);
        let input = new EL(sandbox, 'input', {
            'id': objectIdName,
            'name': objectIdName,
            'type': 'text',
            'class': 'form-control',
            'aria-label': 'Custom ' + objectIdName + ' input component',
            'value': myValue,
            'readonly': 'readonly',
            'style': 'margin-bottom:0.5em;'
        });

        // Create a select-list to filter available options to decrease number of elements that need to be
        // pushed into the DOM
        let filterInput = new EL(sandbox, 'select', {
            'id': 'filterList', 'name': 'filterList', 'class': 'form-control', 'style': 'margin-bottom:0.5em;'
        });
        addCategory('Show All', 0);
        filterInput.el.onchange = function () {
            console.log('Changed filter...');
            listGroupLeft.empty();
            getItems(this.value);
        };

        /*
            1) Create a container with two columns
            2) Iterate through each available item
            3) If the value is NOT selected, add it as a badge to the left column, otherwise add to the right
            4) Add an action event to items on the left, when clicked, move them to the right
            5) Add an action event to the items on the right, when clicked move them to the left
            6) Allow the ability to move objects up or down the stack
        */
        let container = new EL(sandbox, 'div', { 'class': 'sandbox' });

        // The left group contains all unselected elements
        let groupsLeft = new EL(container, 'div', { 'name': 'left', 'class': 'badge-group col-sm-6' });
        let listGroupLeft = new EL(groupsLeft, 'div', { 'class': 'list-group' });

        // The right group contains all selected elements
        let groupsRight = new EL(container, 'div', { 'name': 'right', 'class': 'badge-group  col-sm-6' });
        let listGroupRight = new EL(groupsRight, 'div', { 'class': 'list-group' });

        // Populate the list with default values
        getItems(filterInput.el.value);

        // Populate category list
        getCategories(filterInput.el.value);
    }
    

    // Moves the given element to the right
    moveRight(el) {
        console.log('Moving item ' + el.name + ' to the right');
        listGroupRight.el.appendChild(el.parentElement);
        el.onclick = function () { moveLeft(el); return false; };
        setResult();
    }

    // Moves the given element to the left
    moveLeft(el) {
        console.log('Moving item ' + el.name + ' to the left');
        listGroupLeft.el.appendChild(el.parentElement);
        el.onclick = function () { moveRight(el); return false; };
        setResult();
    }

    // Moves the given element up in the list
    moveUp(el) {
        console.log('Moving item ' + el.name + ' upwards');
        let node = el.parentElement;
        let list = el.parentElement.parentElement;
        list.insertBefore(node, node.previousSibling);
        setResult();
    }

    // Moves the given element down in the list
    moveDown(el) {
        console.log('Moving item ' + el.name + ' downwards');
        let node = el.parentElement;
        let list = el.parentElement.parentElement;
        list.insertBefore(node, node.nextSibling.nextSibling);
        setResult();
    }

    // Adds an item to the drop down button group
    addItem(label, value) {

        // If the value exists, add right, else left
        let target = myValueArray.includes(value.toString()) ? listGroupRight : listGroupLeft;

        let item = new EL(target, 'div', { 'data-value': value, 'type': 'button', 'class': 'list-group-item list-group-item-action', 'style': 'height:3em;' });

        let itemBtn = new EL(item, 'button', { 'class': 'list-group-item-label badge badge-primary', 'style': 'float:left;', 'value': value }, label);
        itemBtn.el.onclick = function () {
            moveRight(this);
            return false;
        };

        let itemBtnDown = new EL(item, 'button', { 'type': 'button', 'class': 'input-group-item-action', 'style': 'float:right;' });
        let itemBtnDownGlyphIcon = new EL(itemBtnDown, 'span', { 'class': 'glyphicon glyphicon-arrow-down' });
        itemBtnDown.el.onclick = function () {
            moveDown(this);
            return false;
        };

        let itemBtnUp = new EL(item, 'button', { 'type': 'button', 'class': 'input-group-item-action', 'style': 'float:right;' });
        let itemBtnUpGlyphIcon = new EL(itemBtnUp, 'span', { 'class': 'glyphicon glyphicon-arrow-up' });
        itemBtnUp.el.onclick = function () {
            moveUp(this);
            return false;
        };

        let itemBtnInfo = new EL(item, 'button', { 'type': 'button', 'class': 'input-group-item-action', 'style': 'float:right;' });
        let itemBtnInfoGlyphIcon = new EL(itemBtnInfo, 'span', { 'class': 'glyphicon glyphicon-edit' });
        itemBtnInfo.el.onclick = function () {
            console.log('Editing ' + label + ' (' + value + ')');
            var url = 'http://' + window.location.host + '/' + editPath + '/Edit/' + value; //inp.el.options[inp.el.selectedIndex].value;
            window.open(url, '_blank');
            return false;
        };
    }

    // Retrieve each item and add it to the appropriate list
    getItems(categoryId) {
        console.log('Called getItems(' + categoryId + ') to ' + postElementRoute + '/' + categoryId + ';');
        let dataToBeSent = {};
        $.post(postElementRoute + '/' + categoryId, dataToBeSent, // gets all elements (as they appear on the db)
            function (formElementData, textStatus) {

                let myElements = [];

                // textStatus contains the status: success, error, etc
                // If server responds with 'success'
                if (textStatus === "success") {
                    console.log('Constructing form element list...');

                    // Counters
                    let i;
                    let n;

                    // Start by extracting the elements that are used by this object
                    for (i = 0; i < myValueArray.length; i++) {

                        let valueInt = parseInt(myValueArray[i]);
                        for (n = 0; n < formElementData.length; n++) {
                            if (valueInt === formElementData[n].id) {
                                myElements.push(n);
                            }
                        }
                    }

                    // Now add values that only exist in myElements array (by ordinal position)
                    // IF they do not already exist
                    let ordinal;
                    if (listGroupRight.el.childNodes.length === 0) {
                        for (i = 0; i < myElements.length; i++) {
                            ordinal = myElements[i];
                            addItem(formElementData[ordinal].label, formElementData[ordinal].id);
                        }
                    }

                    // Remove used elements from formElementData array
                    ordinal = null;
                    myElements.sort(function (a, b) { return b - a; });
                    for (i = 0; i < myElements.length; i++) {
                        ordinal = myElements[i];
                        formElementData.splice(ordinal, 1);
                    }

                    // Now add each remaining item to the list
                    for (i = 0; i < formElementData.length; i++) {
                        addItem(formElementData[i].label, formElementData[i].id);
                    }

                    // Set the default result value
                    setResult();
                } else {
                    console.log('Failed to retrieve form object from server with status: "' + textStatus + '"');
                }
            }, "json"
        );
    }

    // Adds a category to the drop down
    addCategory(label, value) {
        let category = new EL(filterInput, 'option', { 'value': value }, label);
    }

    // Retrieve each category and add it to the category filter
    getCategories(categoryId) {
        console.log('Called getCategories(' + categoryId + ');');
        let dataToBeSent = {};
        $.post(categoryElementRoute + '/' + categoryId, dataToBeSent,
            function (formCategoryData, textStatus) {

                var myElements = [];

                // textStatus contains the status: success, error, etc
                // If server responds with 'success'
                if (textStatus === "success") {
                    console.log('Constructing form category list...');

                    // Now add each item to the list
                    for (i = 0; i < formCategoryData.length; i++) {
                        addCategory(formCategoryData[i].label, formCategoryData[i].id);
                    }

                } else {
                    console.log('Failed to retrieve form category from server with status: "' + textStatus + '"');
                }
            }, "json"
        );
    }

    // Updates the result with selected values
    setResult() {
        let result = Array();
        for (let i = 0; i < listGroupRight.el.childElementCount; i++) {
            result.push(listGroupRight.el.childNodes[i].getAttribute('data-value'));
        }
        input.el.value = result.toString();
        console.log('Setting result');
        return false;
    }
}
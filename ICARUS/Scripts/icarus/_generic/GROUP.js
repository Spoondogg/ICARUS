/**
    A grouping of list items
 */
class GROUP extends EL {

    /**
        Construct a group of NavItems
        @param {EL} node The element that will contain this object
        @param {string} element HTML Element 
        @param {MODEL} model The json object representing this element
     */
    constructor(node, element, model) {
        console.log('GROUP');
        super(node, element, model);
        this.name = model.name; // Required
        this.el.setAttribute('name', model.name);
        this.groups = {};
    }

    /**
        Retrieves the Drop Down Menu Group
        @param {string} name Name of group
        @returns {DROPDOWNMENUGROUP} A menu group
     */
    getGroup(name) {
        return this.groups[name];
    }

    /**
        Adds the given group to this.groups
        @param {GROUP} group A GROUP Element
        @returns {GROUP} The given group
     */
    addGroup(group) {
        this.groups[group.name] = group;
        return this.groups[group.name];
    }

    /**
        Adds or Overrides the given group to this.groups
        @param {GROUP} group A GROUP Element
        @returns {GROUP} The given group
     */
    setGroup(group) {
        if (this.groups[name] === undefined) {
            this.groups[group.name] = group;
        }
        return this.groups[group.name];
    }
}
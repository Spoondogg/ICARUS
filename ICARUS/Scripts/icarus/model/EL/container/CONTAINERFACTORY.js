/**
    Constructs various Containers and returns them to be appended
 */
class CONTAINERFACTORY {
    /**
        A Container Factory
     */
    constructor() {

    }

    /**
        Gets this Container from the database via ajax GET request.
        Retrieves object model and returns the container.

        A placeholder object is created to ensure that values are loaded
        in the appropriate order, regardless of any delays from getJson()

        @param {MODEL} node Parent node (Generally append to node.body.pane)
        @param {string} className Container Constructor Name
        @param {number} id Container UId
        @returns {CONTAINER} A newly constructed container
    */
    get(node, className, id) {
        console.log('CONTAINERFACTORY.get(' + className + ',' + id + ');');
        let index = node.children.push(null); // Reserve the slot in the array
        let span = new SPAN(node, new MODEL());
        return $.getJSON('/' + className + '/Get/' + id, function (result) {
            let obj = null;
            switch (className) {
                case 'LI':
                    obj = new LI(node, result.model);
                    break;

                case 'UL':
                    obj = new UL(node, result.model);
                    break;

                case 'LISTITEM':
                    obj = new LISTITEM(node, result.model);
                    break;

                case 'LIST':
                    obj = new LIST(node, result.model);
                    break;

                case 'MENU':
                    obj = new MENU(node, result.model);
                    break;

                case 'NAVITEM':
                    obj = new NAVITEM(node, result.model);
                    break;

                case 'NAVSEPARATOR':
                    obj = new NAVSEPARATOR(node, result.model);
                    break;

                case 'TEXTBLOCK':
                    obj = new TEXTBLOCK(node, result.model);
                    break;

                case 'JUMBOTRON':
                    obj = new JUMBOTRON(node, result.model);
                    break;

                case 'HEADER':
                    obj = new HEADER(node, result.model);
                    break;

                case 'PARAGRAPH':
                    obj = new PARAGRAPH(node, result.model);
                    break;

                case 'BANNER':
                    obj = new BANNER(node, result.model);
                    break;

                case 'CALLOUT':
                    obj = new CALLOUT(node, result.model);
                    break;

                case 'ARTICLE':
                    obj = new ARTICLE(node, result.model);
                    break;

                case 'SECTION':
                    obj = new SECTION(node, result.model);
                    break;

                case 'FORM':
                    obj = new FORM(node, result.model);
                    break;

                case 'FIELDSET':
                    obj = new FIELDSET(node, result.model);
                    break;

                case 'FORMELEMENTGROUP':
                    obj = new FORMELEMENTGROUP(node, result.model);
                    break;

                case 'INPUT':
                    obj = new INPUT(node, result.model);
                    break;

                case 'SELECT':
                    obj = new SELECT(node, result.model);
                    break;

                case 'TEXTAREA':
                    obj = new TEXTAREA(node, result.model);
                    break;

                case 'OPTION':
                    obj = new OPTION(node, result.model);
                    break;
            }
            node.children[index] = obj;
            if (obj !== null) {
                try {
                    span.el.parentNode.replaceChild(obj.el, span.el);
                } catch (e) {
                    console.log(e);
                }
            } else {
                // Remove the temporary node
                span.destroy();
                node.children.splice(index, 1);
            }
            return node.children[index];
        });
    }
}
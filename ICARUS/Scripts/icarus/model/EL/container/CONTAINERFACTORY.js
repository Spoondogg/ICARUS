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
        debug('CONTAINERFACTORY.get(' + className + ',' + id + ');');

        let span = new SPAN(node, new MODEL());
        let index = node.children.push(span); // Reserve the slot in the array
        
        return $.getJSON('/' + className + '/Get/' + id, function (result) {
            let obj = null;
            switch (className) {
                case 'LI':
                    obj = new LI(span, result.model);
                    break;

                case 'UL':
                    obj = new UL(span, result.model);
                    break;

                case 'LISTITEM':
                    obj = new LISTITEM(span, result.model);
                    break;

                case 'LIST':
                    obj = new LIST(span, result.model);
                    break;

                case 'MENU':
                    obj = new MENU(span, result.model);
                    break;

                case 'NAVITEM':
                    obj = new NAVITEM(span, result.model);
                    break;

                case 'NAVSEPARATOR':
                    obj = new NAVSEPARATOR(span, result.model);
                    break;

                case 'TEXTBLOCK':
                    obj = new TEXTBLOCK(span, result.model);
                    break;

                case 'JUMBOTRON':
                    obj = new JUMBOTRON(span, result.model);
                    break;

                case 'INDEX':
                    obj = new INDEX(span, result.model);
                    break;

                /*
                case 'HEADER':
                    obj = new HEADER(span, result.model);
                    break;
                */

                case 'PARAGRAPH':
                    obj = new PARAGRAPH(span, result.model);
                    break;

                case 'BANNER':
                    obj = new BANNER(span, result.model);
                    break;

                case 'CALLOUT':
                    obj = new CALLOUT(span, result.model);
                    break;

                case 'THUMBNAIL':
                    obj = new THUMBNAIL(span, result.model);
                    break;

                case 'INDEXTHUMBNAIL':
                    obj = new INDEXTHUMBNAIL(span, result.model);
                    break;

                case 'IFRAME':
                    obj = new IFRAME(span, result.model);
                    break;

                case 'ARTICLE':
                    obj = new ARTICLE(span, result.model);
                    break;

                case 'SECTION':
                    obj = new SECTION(span, result.model);
                    break;

                case 'FORM':
                    obj = new FORM(span, result.model);
                    break;

                case 'FIELDSET':
                    obj = new FIELDSET(span, result.model);
                    break;

                case 'FORMELEMENTGROUP':
                    obj = new FORMELEMENTGROUP(span, result.model);
                    break;

                case 'INPUT':
                    obj = new INPUT(span, result.model);
                    break;

                case 'SELECT':
                    obj = new SELECT(span, result.model);
                    break;

                case 'TEXTAREA':
                    obj = new TEXTAREA(span, result.model);
                    break;

                case 'OPTION':
                    obj = new OPTION(span, result.model);
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
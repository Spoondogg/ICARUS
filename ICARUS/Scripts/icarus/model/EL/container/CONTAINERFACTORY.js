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

        @param {EL} node Parent node (Generally append to node.body.pane)
        @param {string} element HTML Element type
        @param {number} id Container UId
        @returns {CONTAINER} A newly constructed container
    */
    get(node, element, id) {
        console.log('CONTAINERFACTORY.get(' + element + ',' + id + ');');
        $.getJSON('/' + element + '/Get/' + id, function (data) {
            let obj = null;
            switch (element) {
                case 'TEXTBLOCK':
                    obj = new TEXTBLOCK(node, data.model); //this.body.pane
                    break;

                case 'JUMBOTRON':
                    obj = new JUMBOTRON(node, data.model);
                    break;

                case 'ARTICLE':
                    obj = new ARTICLE(node, data.model);
                    break;

                case 'SECTION':
                    obj = new SECTION(node, data.model);
                    break;

                case 'FORM':
                    obj = new FORM(node, data.model);
                    break;

                case 'FIELDSET':
                    obj = new FIELDSET(node, data.model);
                    break;

                case 'FORMELEMENTGROUP':
                    obj = new FORMELEMENTGROUP(node, data.model);
                    break;

                case 'INPUT':
                    obj = new INPUT(node, data.model);
                    break;

                case 'SELECT':
                    obj = new SELECT(node, data.model);
                    break;

                case 'TEXTAREA':
                    obj = new TEXTAREA(node, data.model);
                    break;

                case 'OPTION':
                    obj = new OPTION(node, data.model);
                    break;

            }
            node.children.push(obj);
        });
        return node.children[node.children.length - 1];
    }
}
/**
    Textblock Constructor
    A TEXTBLOCK is essentially a DIV that is designed to contain
    rich text (paragraph and span with formatting attributes) and images.

    A textblock can be recursively stacked

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
    @param {number} depth The heirarchy for header elements, classes etc
*/
class TEXTBLOCK extends CONTAINER {
    constructor(node, model, depth) {
        super(node, 'DIV', model);
        this.addClass('textblock');

        this.depth = depth;

        //this.header.options.list.emptyGroup('ELEMENTS');
        this.header.options.list.groups['ELEMENTS'].empty();
        this.header.options.list.groups['ELEMENTS'].addNavItem(
            new MODEL(new ATTRIBUTES(), 'Textblock-woot')
        ).el.onclick = this.expand.bind(this); // this.create.bind(this);


        this.header.options.list.groups['ELEMENTS'].addNavItem(
            new MODEL(new ATTRIBUTES(), 'Paragraph-woot')
        ).el.onclick = function () {
            alert('TODO: Create Paragraph');
        };

        this.header.options.list.groups['ELEMENTS'].addNavItem(
            new MODEL(new ATTRIBUTES(), 'Image-woot')
        ).el.onclick = function () {
            alert('TODO: Create Image');
        };
        
        this.populate(model.children);
    }
}
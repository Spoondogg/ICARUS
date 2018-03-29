/**
    Represents a <TEXTAREA> for an Icarus Form       
*/
class IcarusFormTextArea extends CONTAINER {
    /**
        Construct a Text Area
        @param {EL} node The parent object
        @param {MODEL} model The textarea model
     */
    constructor(node, model) {
        let element = 'TEXTAREA';
        model.name = model.name || 'TEXTAREA_' + guid();

        super(node, element,
            new MODEL(
                new ATTRIBUTES(
                    'form-control',
                    friendly(model.name),
                    null,
                    model.value || ''
                )
            )
        );
        this.addClass('form-textarea');

        if (model.readonly) {
            this.el.setAttribute('readonly', 'readonly');
        }
    }
}
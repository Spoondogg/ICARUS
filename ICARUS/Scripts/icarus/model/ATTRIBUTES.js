/**
    A generic set of ATTRIBUTES for an EL
 */
class ATTRIBUTES extends Object {
    /**
        Constructs a generic Attributes data structure.
        If the 'className' argument is an object, break it out into individual attributes
        Otherwise, map to className, name, type and value (Optionally)

        @param {object} className A collection of attributes || className Element class attribute
        @param {string} name Optional Element name attribute
        @param {string} type Element type attribute
        @param {string} value Element value attribute
     */
    constructor(className, name, type, value) {
        super();
        switch (typeof className) {
            case 'string':            
                this.set('class', className);
                this.set('name', name);
                this.set('type', type);
                this.set('value', value);
                break;

            case 'object':
                for (let attr in className) {
                    this.set(attr, className[attr]);
                }
                break;                
        }        
    }

    /**
        Gets the specified attribute
        @param {string} key Attribute key
        @returns {object} Attribute Object
     */
    get(key) {
        let obj = null;
        try {
            obj = this[key];
        } catch (e) {
            console.log('No attribute exists for key "' + key + '"');
        }
        return obj;
    }

    /**
        @param {string} key Attribute name
        @param {any} value Attribute value
        @returns {ATTRIBUTES} this 
     */
    set(key, value) {
        if (value !== undefined && value !== null) {
            this[key] = value || '';
        }
        return this;
    }

    /**
        Saves the state of this Element
     
    save() {
        console.log('ATTRIBUTES.save()');
        let prompt = new PROMPT(
            'Save ATTRIBUTES()', 'Saves the ATTRIBUTES()',
            [], [
                new MODEL(new ATTRIBUTES({
                    'name': 'formPostId',
                    'value': this.get('attributesId'),
                    'readonly': 'readonly'
                })).set({
                    'element': 'INPUT',
                    'type': 'FORMPOST',
                    'label': 'element'
                })
            ]
        );
        console.log('ATTRIBUTES.FORMELEMENTGROUP');
        console.log(prompt.container.children[0].children[0].children[0]);

        // Override form defaults
        //this.prompt.form.setPostUrl(this.element+'/Set');
        //this.prompt.form.setPostUrl(this.className + '/Set');
        //this.prompt.form.afterSuccessfulPost = this.afterSuccessfulPost.bind(this);

        prompt.show();
    }
    */
}
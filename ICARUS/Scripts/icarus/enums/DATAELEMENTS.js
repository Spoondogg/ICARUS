/**
    @module
    @todo This might be a better fit inside {@link CONTAINERFACTORY}
*/
import MODEL from '../model/MODEL.js';
import ATTRIBUTES from '../model/ATTRIBUTES.js';
/**
    Stores the default DATA ELEMENTS collections for each Class
    This belongs on the database or within a config 
    DataElements can act as a mask to filter values for this element
    @readonly
    @enum {any}
*/
export const DATAELEMENTS = {
    ARTICLE: [],
    SECTION: [
        new MODEL(new ATTRIBUTES({
            'name': 'collapsed',
            'type': 'NUMBER'
        })).set({
            'element': 'INPUT',
            'label': 'Collapsed'
        })
    ],

    CONTAINER: [],
    
    DICTIONARY: [
        new MODEL(new ATTRIBUTES({
            'name': 'language',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'language'
        })
    ],

    LIST: [],
    LISTITEM: [
        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'p'
        })
    ],

    WORD: [
        new MODEL(new ATTRIBUTES({
            'name': 'language',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'language'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'typeId',
            'type': 'NUMBER'
        })).set({
            'element': 'INPUT',
            'label': 'typeId'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'value',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'value'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'definition',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'definition'
        })
    ],

    MAIN: [
        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'p'
        })
    ],

    FORM: [],
    FIELDSET: [],
    FORMELEMENTGROUP: [],
    FORMELEMENT: [],

    FORMPOST: [],

    CALLOUT: [
        new MODEL(new ATTRIBUTES({
            'name': 'icon',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'icon'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'header',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'header'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'p'
        })
    ],

    INPUT: [
        new MODEL(new ATTRIBUTES({
            'name': 'type',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'type'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'name',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'name'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'value',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'value'
        })
    ],
    FORMPOSTINPUT: [],
    THUMBNAIL: [
        new MODEL(new ATTRIBUTES({
            'name': 'img',
            'type': 'NUMBER'
        })).set({
            'element': 'BUTTON',
            'label': 'img',
            'type': 'FORMPOSTINPUT',
            'inputs': [
                new MODEL(new ATTRIBUTES({
                    'name': 'file',
                    'type': 'file'
                })).set({
                    'element': 'INPUT',
                    'label': 'file'
                })
            ]
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'header',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'header'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'p'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'bgImage',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'bgImage'
        })
    ],

    JUMBOTRON: [
        new MODEL(new ATTRIBUTES({
            'name': 'header',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'header'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'p'
        }),
        
        new MODEL(new ATTRIBUTES({
            'name': 'bgimage',
            'type': 'NUMBER'
        })).set({
            'element': 'BUTTON',
            'label': 'bgimage',
            'type': 'FORMPOSTINPUT',
            'inputs': [
                new MODEL(new ATTRIBUTES({
                    'name': 'file',
                    'type': 'file'
                })).set({
                    'element': 'INPUT',
                    'label': 'file'
                })
            ]
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'screencolor',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'screencolor'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'bgcolor',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'bgcolor'
        })
    ],

    PARAGRAPH: [
        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'p'
        })
    ],

    TEXTBLOCK: [
        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'text'
        })
    ]
};
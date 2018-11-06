/** @module */
import ATTRIBUTES from '../model/ATTRIBUTES.js';
import MODEL from '../model/MODEL.js';
/* eslint-disable max-params */
/** Instantiates an INPUT MODEL
    @param {string} element Element name
    @param {string} name Input name
    @param {string} label Label to display
    @param {string} value Value of input
    @param {string} type The input type
    @param {number} showNav If 1, NavBar is shown
    @returns {MODEL} An input model
*/
export const createInputModel = (element, name, label, value = '', type = 'TEXT', showNav = 0) => new MODEL(
    new ATTRIBUTES({
        name,
        value,
        type: type === 'FORMPOSTINPUT' ? 'NUMBER' : type
    })
).set({
    showNav,
    element,
    label,
    type
});
/* eslint-enable max-params */
/** Stores the default DATA ELEMENTS collections for each Class
    This belongs on the database or within a config 
    DataElements can act as a mask to filter values for this element
    @see CONTAINER.createInputModel() Consider a static method
    @readonly
    @enum {any}
*/
export const DATAELEMENTS = {
    ARTICLE: [createInputModel('INPUT', 'header', 'header', 'Article Header')],
    CALLOUT: [
        new MODEL(new ATTRIBUTES({
            name: 'icon',
            type: 'text'
        })).set({
            element: 'INPUT',
            label: 'icon'
        }),
        new MODEL(new ATTRIBUTES({
            name: 'header',
            type: 'text'
        })).set({
            element: 'INPUT',
            label: 'header'
        }),
        new MODEL(new ATTRIBUTES({
            name: 'p',
            type: 'text'
        })).set({
            element: 'INPUT',
            label: 'p'
        })
    ],
    CONTAINER: [createInputModel('INPUT', 'showNav', 'showNav', '1', 'NUMBER')],
	DICTIONARY: [
		new MODEL(new ATTRIBUTES({
			name: 'language',
			type: 'text'
		})).set({
			element: 'INPUT',
			label: 'language'
		})
    ],
    FIELDSET: [],
    FORM: [],
    FORMELEMENT: [createInputModel('INPUT', 'showNav', 'showNav', '1', 'NUMBER')],
    FORMELEMENTGROUP: [],
    FORMPOST: [],
    FORMPOSTINPUT: [],
    INDEX: [],
    INDEXMAIN: [],
    INPUT: [
        new MODEL(new ATTRIBUTES({
            name: 'showNav',
            type: 'NUMBER',
            value: 0
        })).set({
            element: 'INPUT',
            label: 'showNav'
        }),
        new MODEL(new ATTRIBUTES({
            name: 'type',
            type: 'text'
        })).set({
            element: 'INPUT',
            label: 'type'
        }),
        new MODEL(new ATTRIBUTES({
            name: 'name',
            type: 'text'
        })).set({
            element: 'INPUT',
            label: 'name'
        }),
        new MODEL(new ATTRIBUTES({
            name: 'value',
            type: 'text'
        })).set({
            element: 'INPUT',
            label: 'value'
        })
    ],
    JUMBOTRON: [
        createInputModel('INPUT', 'header', 'header', 'JT Header'),
        createInputModel('INPUT', 'p', 'p', 'JT Paragraph'),
        //createInputModel('BUTTON', 'bgimage', 'bgimage', 0, 'FORMPOSTINPUT'),
        new MODEL(new ATTRIBUTES({
            name: 'bgimage',
            type: 'NUMBER'
        })).set({
            element: 'BUTTON',
            label: 'bgimage',
            type: 'FORMPOSTINPUT',
            showNav: 0,
            inputs: [
                new MODEL(new ATTRIBUTES({
                    name: 'file',
                    type: 'file'
                })).set({
                    element: 'INPUT',
                    label: 'file'
                })
            ]
        }),
        createInputModel('INPUT', 'screencolor', 'screencolor'),
        createInputModel('INPUT', 'bgcolor', 'bgcolor')
    ],	
	LIST: [],
	LISTITEM: [
		new MODEL(new ATTRIBUTES({
			name: 'p',
			type: 'text'
		})).set({
			element: 'INPUT',
			label: 'p'
		})
	],	
	MAIN: [
		new MODEL(new ATTRIBUTES({
			name: 'p',
			type: 'text'
		})).set({
			element: 'INPUT',
			label: 'p'
		})
    ],
    PARAGRAPH: [
        new MODEL(new ATTRIBUTES({
            name: 'p',
            type: 'text'
        })).set({
            element: 'INPUT',
            label: 'p'
        })
    ],
    SECTION: [
        new MODEL(new ATTRIBUTES({
            name: 'collapsed',
            type: 'NUMBER'
        })).set({
            element: 'INPUT',
            label: 'collapsed'
        })
    ],
    TEXTBLOCK: [
        new MODEL(new ATTRIBUTES({
            name: 'p',
            type: 'text'
        })).set({
            element: 'INPUT',
            label: 'text'
        })
    ],
	THUMBNAIL: [
		new MODEL(new ATTRIBUTES({
			name: 'img',
			type: 'NUMBER'
		})).set({
			element: 'BUTTON',
			label: 'img',
			type: 'FORMPOSTINPUT',
			inputs: [
				new MODEL(new ATTRIBUTES({
					name: 'file',
					type: 'file'
				})).set({
					element: 'INPUT',
					label: 'file'
				})
			]
		}),
		new MODEL(new ATTRIBUTES({
			name: 'header',
			type: 'text'
		})).set({
			element: 'INPUT',
			label: 'header'
		}),
		new MODEL(new ATTRIBUTES({
			name: 'p',
			type: 'text'
		})).set({
			element: 'INPUT',
			label: 'p'
		}),
		new MODEL(new ATTRIBUTES({
			name: 'bgImage',
			type: 'text'
		})).set({
			element: 'INPUT',
			label: 'bgImage'
		})
	],
    WORD: [
        new MODEL(new ATTRIBUTES({
            name: 'language',
            type: 'text'
        })).set({
            element: 'INPUT',
            label: 'language'
        }),
        new MODEL(new ATTRIBUTES({
            name: 'typeId',
            type: 'NUMBER'
        })).set({
            element: 'INPUT',
            label: 'typeId'
        }),
        new MODEL(new ATTRIBUTES({
            name: 'value',
            type: 'text'
        })).set({
            element: 'INPUT',
            label: 'value'
        }),
        new MODEL(new ATTRIBUTES({
            name: 'definition',
            type: 'text'
        })).set({
            element: 'INPUT',
            label: 'definition'
        })
    ]
};
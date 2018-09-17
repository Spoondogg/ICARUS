/**
    @module
*/
import CONTAINER from '../CONTAINER.js';
import HEADER from '../../header/HEADER.js';
import HR from '../../hr/HR.js';
import P from '../../p/P.js';
import EL, { MODEL, ATTRIBUTES } from '../../EL.js';
/**
    A full width Container with a fixed height
    @description A lightweight, flexible component that can optionally extend the entire 
    viewport to showcase key content on your site.
    @see https://getbootstrap.com/docs/3.3/components/#jumbotron }

    @class
    @extends CONTAINER
*/
export default class JUMBOTRON extends CONTAINER {
    /**
        Constructs a Bootstrap style Jumbotron
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model        
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.body.pane.addClass('jumbotron');
    }

    /**
        Override abstract method
     */
    construct() {
        if (this.dataId > 0) {
            this.screen = new EL(this.body.pane, 'DIV', new MODEL(new ATTRIBUTES('screen')));
            if (this.data.screencolor && this.data.screencolor !== '.') {
                this.screen.el.setAttribute('style', 'background-color: '+this.data.screencolor+';');
            }

            this.header = new HEADER(this.screen, new MODEL().set({
                'label': this.data.header
            }), 1);

            if (this.data.p) {
                if (this.data.p.length > 0) {
                    this.hr = new HR(this.screen, new MODEL());
                    this.p = new P(this.screen, new MODEL(), this.htmlDecode(this.data.p));
                }
            }

            this.loadBgImage();

            if (this.data.bgcolor && this.data.bgcolor !== '.') {
                this.body.pane.el.style.backgroundColor = this.data.bgcolor;
            }
        }
    }

    /**
        Attempt to retrieve a background image if one is specified
        in this.data.bgimage
    */
    loadBgImage() {           
        if (this.data.bgimage !== '0' && this.data.bgimage !== '.') {
            try {
                $.getJSON('/FORMPOST/Get/' + parseInt(this.data.bgimage), function (data) {
                    // If access granted...
                    if (data.model) {
                        if (data.model.jsonResults) {
                            //console.log('Retrieved image id: ' + parseInt(this.data.bgimage));
                            //console.log(data.model);
                            console.log('Parsed...');
                            let parsed = JSON.parse(data.model.jsonResults);
                            console.log(parsed);

                            // Extract the base64 values and create an image
                            for (let p = 0; p < parsed.length; p++) {
                                if (parsed[p].name === 'base64') {
                                    this.body.pane.el.setAttribute('style',
                                        'background: url(' + parsed[p].value + ');'
                                    );
                                }
                            }
                        } else {
                            console.log('Json Results are empty');
                        }
                    }
                }.bind(this));
            } catch (e) {
                console.log('Unable to retrieve FormPost.');
                console.log(e);
            }
        }
    }
}
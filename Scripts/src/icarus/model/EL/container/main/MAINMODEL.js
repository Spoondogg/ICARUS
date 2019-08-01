//import CONTAINER, { EL, MODEL } from '../CONTAINER.js';
import CONTAINERFACTORY, { EL, MODEL } from '../CONTAINERFACTORY.js';
import LOADER from '../../dialog/loader/LOADER.js';
/** MAINMODEL Additional Properties
    @typedef {Object} props Properties
    @property {CONTAINERFACTORY} factory MAIN Factory
    @property {LOADER} loader Application LOADER
    @property {URL} url URL
*/
export default class MAINMODEL extends MODEL {
    /** A MAIN MODEL
        @param {ContainerModel} model Model
        @param {props} props Properties
    */
    constructor(model, props) {
        super(model.attributes, model.data, model.meta);
        /** MAIN CONTAINERFACTORY
            @type {CONTAINERFACTORY}
        */
        this.factory = this.required(props.factory);
        /** Application LOADER
            @type {LOADER}
        */
        this.loader = this.required(props.loader);
        /** Url
            @type {URL}
        */
        this.url = this.required(props.url);
    }
}
export { CONTAINERFACTORY, EL, LOADER, MODEL }
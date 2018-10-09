/**
    @namespace ICARUS
*/
/**
    @module 
*/
import CONTAINERFACTORY from './CONTAINERFACTORY.js';
import CONTROLLER from './CONTROLLER.js';
import TOKEN from './TOKEN.js';
//import CONTAINER from '../model/el/container/CONTAINER.js';
/**
    An Application Controller
    @class
    @extends CONTROLLER
    @memberof ICARUS
    @description An Application Controller (APP)
    Constructs the main Application Controller and initializes the MAIN Container
    This should be instantiated during the init phase of the html document
*/
export default class APP extends CONTROLLER { // extends CONTROLLER
	/**
		Constructs an Application
		@param {number} id The unique application id
		@param {string} user A friendly username for the current user
		@param {boolean} dev If true, dev-options are enabled
		@param {number} recursionLimit Limits recursion depth 
	    @param {CONTAINERFACTORY} factory The container constructor factory
	*/
	constructor(id = 0, user = 'Guest', dev = false, recursionLimit = 100) {
		super(id, user, dev, recursionLimit, 'Icarus', '0.5.20181002', TOKEN.getToken().value, new CONTAINERFACTORY());
	}
}
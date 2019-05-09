/** @namespace ICARUS */
/** @module */
import CONTAINERFACTORY from '../model/el/container/CONTAINERFACTORY.js';
import CONTROLLER from './CONTROLLER.js';
import TOKEN from './TOKEN.js';
/** An Application Controller
    @class
    @extends CONTROLLER
    @memberof ICARUS
    @description An Application Controller (APP)
    Constructs the MAIN Controller and initializes the MAIN Container
    This should be instantiated during the init phase of the html document
*/
export default class APP extends CONTROLLER {
	/** Constructs an Application
		@param {UId} id The unique application id
		@param {EmailAddress} user A friendly username for the current user
		@param {boolean} dev If true, dev-options are enabled
		@param {number} recursionLimit Limits recursion depth
	*/
	constructor(id = 0, user = 'Guest', dev = false, recursionLimit = 100) {
		super(id, user, dev, recursionLimit, 'spoonMEDIA', '0.6.20190501', TOKEN.setToken().value, new CONTAINERFACTORY());
	}
}
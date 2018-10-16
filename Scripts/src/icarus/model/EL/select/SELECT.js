/**
    @module
*/
import EL from '../EL.js';
/**
    A SELECT element
*/
export default class SELECT extends EL {
	constructor(node, model) {
		super(node, 'SELECT', model);
	}
}
import MODEL from '../../../MODEL.js';
import { PAYLOAD } from '../../EL.js';
/** A cache of the application models by uid, grouped into
    Containers and FormPosts.  Objects are wrapped inside a 'cached' object
    @class
*/
export default class CACHE extends MODEL {
    constructor() {
        super();
        //console.log('Cache initialized');
        this.set('FORMPOST', {});
        this.set('CONTAINER', {});
    }
    /** If object is stale, retrieve new
        @param {string} type Object Type
        @param {UId} uid Object UId
        param {number} age Age (in seconds) before a refresh should occur
        @returns {Promise<MODEL>} Payload to cache
    */
    cacheObject(type, uid) { //age = 30
        return new Promise((resolve, reject) => {
            //this[type][uid] = obj;
            if (parseInt(uid) > 0) {
                this.getPayload(uid, type).then((payload) => {
                    //console.log('Cache.cacheObj', payload);
                    try {
                        if (typeof payload.model.jsonResults !== 'undefined') {
                            payload.model.jsonResults = JSON.parse(payload.model.jsonResults);
                        }
                    } catch (e) {
                        console.log('Unable to parse json', uid, payload);
                    }
                    this[type][uid] = payload.model;
                    //console.log('cache', this, age);
                    resolve(this[type][uid]);
                });
            //} else if (parseInt(uid) > 0) {
                //reject(new Error('Failed to cache ' + type + ', ' + uid));
            } else {
                reject(new Error('Failed to cache ' + type + '.  UId is not valid'));
            }
        })
    }
}
export { PAYLOAD }
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
            if (this[type][uid] === null) {
                console.info('CACHE was already attempted', type, uid);
                resolve(null);
            } else if (parseInt(uid) > 0) {
                this.getPayload(uid, type).then((payload) => {
                    if (payload.className === 'ERROR') {
                        //console.error(this.toString() + '.getPayload', uid, type, payload.message);
                        this[type][uid] = uid;
                    } else if (payload.model !== null) {
                        //console.log('Cache.cacheObj', payload);
                        try {
                            if (typeof payload.model.jsonResults !== 'undefined') {
                                payload.model.jsonResults = JSON.parse(payload.model.jsonResults);
                            }
                        } catch (e) {
                            console.log('Unable to parse json', uid, payload);
                        }
                        this[type][uid] = payload.model;
                    }
                    //console.log('cache', this, age);
                    resolve(this[type][uid]);
                });
                //} else if (parseInt(uid) > 0) {
                //reject(new Error('Failed to cache ' + type + ', ' + uid));
            } else {
                let msg = this.toString() + '.cacheObject: Failed to cache ' + type + '.  UId is not valid';
                console.error(msg);
                reject(new Error(msg));
            }
        })
    }
}
export { PAYLOAD }
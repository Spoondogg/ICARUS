/** @module */
import BUTTONGROUP, { BUTTON, Deactivate } from '../../../../group/buttongroup/BUTTONGROUP.js';
import NAVTHUMBNAIL, { ATTRIBUTES, EL, ICONS, MODEL, STRING } from '../NAVTHUMBNAIL.js';
import PROMPT, { DIALOGMODEL } from '../../../../dialog/prompt/PROMPT.js';
import CONTAINERINDEX from '../../../../container/index/classindex/containerindex/CONTAINERINDEX.js';
import DIV from '../../../../div/DIV.js';
import TAGGROUP from '../../../../group/buttongroup/taggroup/TAGGROUP.js';
/** A full-width NavItem with a Thumbnail image, label and description
    @class
*/
export default class CONTAINERTHUMBNAIL extends NAVTHUMBNAIL {
	/** Constructs a THUMBNAIL displaying details of a given CONTAINER
        @param {CONTAINER} node The model
        @param {MODEL} model The Thumbnail model
        @param {number} model.id Unique Identifier that this thumbnail represents
        @param {string} model.subsections Delimited string of uids
        @param {string} model.authorId Author Id
        @param {string} model.label The Thumbnail label
        @param {string} model.description Description
        @param {string} model.tags Comma delimited list of tag uids
        @param {object} model.jsonResults JSON Results
        @param {string} classType The class that this thumbnail represents
    */
	constructor(node, model, classType) {
		super(node, model, classType);
        this.addClass('nav-item-thumbnail-container');
    }
    /** Constructs a thumbnail that represents the given model
        @param {MODEL} model Model
        @returns {void}
    */
    constructThumbnail(model) {
        this.header.setInnerHTML(model.label);
        this.p.setInnerHTML(new STRING(model.description || 'N/A').truncate(128));
        this.addThumbDetails(model);
        this.addTags(model);
        //this.fetchImage(); // Only if IMG exists
    }
    /** Adds a button group and a default tag
        @param {MODEL} model Model
        @returns {void}
    */
    addTags(model) {
        this.tagGroup = new TAGGROUP(this.anchor);
        if (typeof model.tags !== 'undefined') {
            model.tags.split(',').forEach((t) => {
                if (t > 0) {
                    // First, check if tag has been cached
                    let container = this.getContainer();
                    //let main = container.getMain();
                    //console.log('addTags()', container, main, main.cache);
                    /** @type {CACHE} */
                    let cache = container.getCache();
                    let cached = cache.FORMPOST[t];
                    //console.log('Main Cache Formpost', cached);
                    // If available, use cache to generate tag, or create cache
                    if (typeof cached === 'undefined') {
                        // Retrieve model and cache it
                        //console.log('attempting to cache tag "' + t + '"');
                        /** @type {CACHE} */
                        cache.cacheObject('FORMPOST', t).then((mdl) => {
                            //console.log('Successfully cached ' + t, mdl);
                            this.createTagButton(mdl);
                        });
                        
                    } else {
                        //console.warn('Tag already cached', t, cached, cached.jsonResults[0].value);
                        this.createTagButton(cached);
                    }
                    /*
                    try {
                        // Then use cache to generate tag
                        let tagName = this.getContainer().getCache().FORMPOST[t].jsonResults[0].value;
                        console.log('tagName', tagName);
                        let btn = this.tagGroup.addButton('#' + t, ICONS.TAG);
                        btn.el.addEventListener('click', () => {
                            console.log('Clicked tag # ' + t, tagName);
                        });
                    } catch (e) {
                        console.error('Unable to read cached tag', t, cache, e)
                    }
                    */
                }
            });
        }
    }
    /** Creates a TAG / Switchable Button inside a TAGGROUP and adds Events
        @param {MODEL} model Model
        @param {EL} caller Calling EL
        @returns {void}
    */
    createTagButton(model) {
        //console.log('createTagButton', model);
        try {
            // Then use cache to generate tag
            let tagName = model.jsonResults[0].value;
            //console.log('tagName', tagName);
            let btn = this.tagGroup.addSwitch(tagName, ICONS.TAG);
            btn.addClass('tag');
            //btn.implement(new Clickable(btn));
            btn.el.addEventListener('activate', (ev) => {
                try {
                    this.getDialog().close();
                } catch (e) {
                    console.warn('No dialog exists to close for TAG ' + tagName, btn);
                }
                ev.stopPropagation();
                //console.log('Activated tag #' + model.id + ', ' + tagName);                
                this.searchByTagId(model.id, btn).then((dialog) => {
                    dialog.closeActiveDialogs();
                    btn.el.addEventListener('deactivate', () => dialog.close());
                });
            });
        } catch (e) {
            console.error('Unable to create cached tag', model.id, e)
        }
    }
    deactivateActiveTags() {
        // deactivate any active tags
        let activeTags = $('.tag.active');
        for (let t = 0; t < activeTags.length; t++) {
            activeTags[t].dispatchEvent(new Deactivate(activeTags[t]));
        }
        /*activeTags.each((t) => {
        console.log('deactivate tag', activeTags[t]);
        if (activeTags[t] === btn.el) {
            console.log('No need to deactivate this');
        } else {
            activeTags[t].dispatchEvent(new Deactivate(activeTags[t]));
        }
        });*/
    }
    /** Retrieves a list of MAIN CONTAINERS that are tagged with the given tag uid
        and sets the DIALOG for this CONTAINERTHUMBNAIL to a CONTAINERINDEX holding
        the search results

        @param {UId} id Tag UId
        @param {EL} caller Calling EL
        @returns {Promise<PROMPT>} Promise to resolve a DIALOG containing search results
    */
    searchByTagId(id, caller = this) { //
        //this.getContainer().getJson('/MAIN/SearchByTagId?tag=' + id, (payload) => {
        return new Promise((resolve, reject) => {
            //console.log('SearchByTagId', id, 'Caller', caller);
            try {
                this.dialog = new PROMPT(new DIALOGMODEL(new MODEL(), {
                    container: this.getContainer(),
                    caller,
                    label: 'SearchByTagId ' + id,
                    text: 'Search by tag id'
                }));
                this.containerindex = new CONTAINERINDEX(this.dialog.body.pane, new MODEL().set({
                    container: this.getContainer(),
                    caller
                }), {
                    classType: 'MAIN',
                    searchType: 'TAGID',
                    query: id
                });
                
                this.dialog.show().then((d) => {
                    caller.el.dispatchEvent(new Deactivate(caller));
                    resolve(d);
                });
            } catch (e) {
                console.warn('SearchByTagId Error', e);
                reject(e);
            }
        });
    }
    /** Retrieves a list of MAIN CONTAINERS that are tagged with the given tag uid
        @param {string} tag Tag
        @returns {void}
    */
    searchByTag(tag) {
        console.log('Clicked tag ' + tag);
        this.getContainer().getJson('/MAIN/SearchByTag?tag=' + tag, (payload) => {
            console.log('SearchByTag', tag, payload);
        });
    }
    /** Adds details like author and rating/rank
        @param {MODEL} model Model
        @returns {void}
    */
    addThumbDetails(model) {
        this.detail = new DIV(this.anchor, new MODEL('detail'));
        this.detail.authorId = new DIV(this.detail, new MODEL('left').set('innerHTML', model.authorId));
        this.detail.rating = new BUTTONGROUP(this.detail, new MODEL('right star-group'));
        this.detail.rating.addButton('', ICONS.STAREMPTY);
        this.detail.rating.addButton('', ICONS.STAREMPTY);
        this.detail.rating.addButton('', ICONS.STAR);
        this.detail.rating.addButton('', ICONS.STAR);
        this.detail.rating.addButton('', ICONS.STAR);
    }
}
export { ATTRIBUTES, BUTTON, EL, MODEL }
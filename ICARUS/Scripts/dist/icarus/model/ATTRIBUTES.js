export default class ATTRIBUTES{constructor(t,e,s,r){switch(typeof t){case"string":this.set("class",t),this.set("name",e),this.set("type",s),this.set("value",r);break;case"object":for(let e in t)"string"==typeof e?this.set(e,t[e]):console.warn("Unable to set attribute",e)}}get(t){try{return this[t]}catch(e){return console.warn('No attribute exists for key "'+t+'"',e),null}}set(t,e){return null!=e&&(this[t]=e||""),this}}
//# sourceMappingURL=ATTRIBUTES.js.map

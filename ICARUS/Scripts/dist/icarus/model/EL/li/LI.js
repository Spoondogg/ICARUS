import EL,{ATTRIBUTES,MODEL}from"../EL.js";import ANCHOR from"../a/anchor/ANCHOR.js";export default class LI extends EL{constructor(r,t){super(r,"LI",t,t.label)}addAnchor(r){return this.children.push(new ANCHOR(this,r)),this.children[this.children.length-1]}}export{ANCHOR,ATTRIBUTES,EL,MODEL};
//# sourceMappingURL=LI.js.map

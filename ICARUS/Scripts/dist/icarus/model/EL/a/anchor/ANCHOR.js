import A,{ATTRIBUTES,EL,MODEL}from"../A.js";import GLYPHICON from"../../span/GLYPHICON.js";export default class ANCHOR extends A{constructor(e,s){super(e,s),s.icon?this.icon=new GLYPHICON(this,s.label?s.label:"",s.icon):this.setInnerHTML(this.el.innerHTML+=s.label)}}export{A,ATTRIBUTES,EL,GLYPHICON,MODEL};
//# sourceMappingURL=ANCHOR.js.map

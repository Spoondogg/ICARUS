import EL,{ATTRIBUTES,MODEL}from"../EL.js";import GLYPHICON from"../span/GLYPHICON.js";export default class BUTTON extends EL{constructor(s,t,e,n){super(s,"BUTTON",new MODEL(new ATTRIBUTES({class:"btn glyphicon",type:n||"BUTTON"}))),this.icon=new GLYPHICON(this,t,e)}setLabel(s,t){this.icon.label.setInnerHTML(s),t&&this.icon.setIcon(t)}}
//# sourceMappingURL=BUTTON.js.map

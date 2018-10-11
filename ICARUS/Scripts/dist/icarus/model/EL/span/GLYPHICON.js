import SPAN,{ATTRIBUTES,MODEL}from"./SPAN.js";import{ICONS}from"../../../enums/ICONS.js";export default class GLYPHICON extends SPAN{constructor(s,e,t){super(s,new MODEL),this.addClass("icon glyphicon "+t),this.label=new SPAN(this,new MODEL("icon-label"),e)}setIcon(s){this.el.className=s}}export{ICONS};
//# sourceMappingURL=GLYPHICON.js.map

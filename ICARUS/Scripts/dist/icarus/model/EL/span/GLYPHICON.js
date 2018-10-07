import SPAN,{ATTRIBUTES,MODEL}from"./SPAN.js";import{ICONS}from"../../../enums/ICONS.js";export default class GLYPHICON extends SPAN{constructor(e,s,t){super(e,new MODEL(new ATTRIBUTES(t||""))),this.addClass("icon glyphicon"),this.label=new SPAN(this,new MODEL(new ATTRIBUTES("icon-label")),s)}setIcon(e){this.el.className=e}}export{ICONS};
//# sourceMappingURL=GLYPHICON.js.map

import SPAN,{ATTRIBUTES,EL,MODEL}from"../span/SPAN.js";export default class A extends EL{constructor(t,e){super(t,"A",e),this.href=e.attributes.href||"#",this.label=new SPAN(this,new MODEL("label").set({label:e.label}))}setTarget(t){this.target=t,this.el.setAttribute("target",t)}}export{ATTRIBUTES,EL,MODEL,SPAN};
//# sourceMappingURL=A.js.map

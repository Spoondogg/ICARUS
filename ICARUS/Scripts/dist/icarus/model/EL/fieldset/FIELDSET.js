import CONTAINER,{ATTRIBUTES,EL,MODEL}from"../container/CONTAINER.js";import FORMELEMENTGROUP from"../container/formelement/FORMELEMENTGROUP.js";import LEGEND from"../legend/LEGEND.js";export default class FIELDSET extends CONTAINER{constructor(E,e){super(E,"FIELDSET",e,["FORMELEMENTGROUP"]),this.addCase("FORMELEMENTGROUP",()=>this.addFormElementGroup(e)),this.populate(e.children)}construct(){this.dataId>0&&this.data.legend&&(this.legend=new LEGEND(this.body.pane,new MODEL,this.data.legend))}addFormElementGroup(E){return this.children.push(new FORMELEMENTGROUP(this.body.pane,E)),this.addGroup(this.children[this.children.length-1])}}export{ATTRIBUTES,EL,MODEL};
//# sourceMappingURL=FIELDSET.js.map

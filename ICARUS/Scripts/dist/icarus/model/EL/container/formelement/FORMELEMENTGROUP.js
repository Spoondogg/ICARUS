import CONTAINER,{ATTRIBUTES,EL,MODEL}from"../CONTAINER.js";import FORMINPUT from"./forminput/FORMINPUT.js";import FORMPOSTINPUT from"./formpostinput/FORMPOSTINPUT.js";import FORMSELECT from"./formselect/FORMSELECT.js";import FORMTEXTAREA from"./formtextarea/FORMTEXTAREA.js";export default class FORMELEMENTGROUP extends CONTAINER{constructor(e,t){super(e,"DIV",t,["INPUT","SELECT","TEXTAREA"]),this.addClass("form-element-group"),this.populate(t.children)}construct(){}addInputElements(e){for(let t=0;t<e.length;t++){let T=null;if("FORMPOSTINPUT"===e[t].type||"FORMPOSTINPUT"===e[t].attributes.type)T=new FORMPOSTINPUT(this.body.pane,e[t]);else switch(e[t].element){case"TEXTAREA":T=new FORMTEXTAREA(this.body.pane,e[t]);break;case"SELECT":T=new FORMSELECT(this.body.pane,e[t]);break;default:T=new FORMINPUT(this.body.pane,e[t])}this.children.push(T)}return this}}export{ATTRIBUTES,EL,FORMELEMENTGROUP,MODEL};
//# sourceMappingURL=FORMELEMENTGROUP.js.map

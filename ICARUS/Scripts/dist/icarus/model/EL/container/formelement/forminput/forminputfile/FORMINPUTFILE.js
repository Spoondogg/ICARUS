import FORMINPUT,{ATTRIBUTES,MODEL}from"../FORMINPUT.js";import FORMTEXTAREA from"../../formtextarea/FORM9TEXTAREA.js";export default class FORMINPUTFILE extends FORMINPUT{constructor(e,t){super(e,new MODEL(new ATTRIBUTES({type:"FILE",name:t.attributes.name}))),this.base64=new FORMTEXTAREA(this.body.pane,(new MODEL).set({name:"base64"})),this.dataElements.push(new MODEL(new ATTRIBUTES({name:"accept",type:"text"})).set({element:"INPUT",label:"accept"}))}}
//# sourceMappingURL=FORMINPUTFILE.js.map

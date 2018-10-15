import FORMINPUT,{ATTRIBUTES,EL,FORMELEMENT,MODEL}from"../../formelement/forminput/FORMINPUT.js";import DIV from"../../../div/DIV.js";import FORM from"../../../form/FORM.js";import INPUT from"../../../input/INPUT.js";import MODAL from"../../../modal/MODAL.js";import SPAN from"../../../span/SPAN.js";export default class FORMPOSTINPUT extends FORMELEMENT{constructor(e,t){super(e,"DIV",t),this.createInput()}createInput(){this.inputGroup=new DIV(this.body.pane,new MODEL(new ATTRIBUTES("input-group"))),this.input=new INPUT(this.inputGroup,new MODEL(new ATTRIBUTES({class:"form-control",name:this.attributes.name,value:this.attributes.value,type:this.attributes.type||"text"}))),this.form=null,(this.attributes.value>0||this.value>0)&&(this.btnEdit=new SPAN(this.inputGroup,new MODEL(new ATTRIBUTES("input-group-addon")),"EDIT1"),this.btnEdit.el.onclick=this.editFormPost.bind(this)),this.btnNew=new SPAN(this.inputGroup,new MODEL(new ATTRIBUTES("input-group-addon")),"NEW1"),this.btnNew.el.onclick=(()=>{this.newAttributes(this.getContainer(),this.attributes.name,this)})}updateInput(e){this.input.el.value=e}defaultInputArray(e){return[new MODEL(new ATTRIBUTES({name:"shared",value:e.model.shared})).set({element:"INPUT",label:"shared",value:"1"}),new MODEL(new ATTRIBUTES({name:"id",value:e.model.id})).set({element:"INPUT",label:"id"})]}appendAdditionalModelInputs(e,t){try{for(let r=0;r<t.length;r++)e.push(t[r])}catch(e){console.warn("No additional inputs exist for this form post",e)}return e}newAttributes(e,t,r){try{$.getJSON("/FORMPOST/Get/0",o=>{let s=this.defaultInputArray(o);this.appendAdditionalModelInputs(s,r.inputs),this.input.el.setAttribute("value",o.model.id),e[t]=o.model.id,"dataId"===t&&e.dataElements.length>0&&this.appendAdditionalModelInputs(s,e.dataElements),"descriptionId"===t&&s.push(new MODEL(new ATTRIBUTES({name:"description",type:"text"})).set({element:"TEXTAREA",label:"description"})),this.createForm(s)})}catch(e){console.log(0,"Unable to retrieve FormPost.",e)}}successfulFormPost(e,t){this.updateInput(e.model.id),new Promise((e,r)=>{t.quickSave(!0)?e(!0):r(Error("Failed to QuickSave"))}).then(e=>{let r=t.getProtoTypeByClass("CONTAINER");return null!==r&&r.refresh(),e},e=>(console.log("promise fail",e),e))}createForm(e){this.form=FORM.createEmptyForm(this.body.pane),this.form.id=3,this.form.el.setAttribute("id",3),this.form.prompt=this,this.form.fieldset.formElementGroup.navBar.header.menu.getGroup("ELEMENTS").empty(),this.addFormElementGroupContainerCase(["INPUT","SELECT","TEXTAREA"]),this.addInputs(e),this.form.setPostUrl("FormPost/Set"),this.form.afterSuccessfulPost=(()=>{this.successfulFormPost()})}createInputArrayHtmlDecoded(e,t){for(let r=0;r<e.length;r++)"id"!==e[r].name&&t.push(new MODEL(new ATTRIBUTES({name:e[r].name,value:this.htmlDecode(e[r].value)||""})).set({element:"INPUT",label:e[r].name}));return t}editFormPost(){let e=[new MODEL(new ATTRIBUTES({name:"id",value:this.input.attributes.value})).set({element:"INPUT",type:"FORMPOST",label:"id"})];try{$.getJSON("/FORMPOST/Get/"+this.input.attributes.value,t=>{t.model?t.model.jsonResults?(e=this.createInputArrayHtmlDecoded(JSON.parse(t.model.jsonResults),e),this.createForm(e)):console.log("Json Results empty"):(this.prompt=new MODAL("Exception",t.message).show(),this.getMainContainer().login())})}catch(e){console.log("Unable to retrieve FormPost.",e)}}addInputs(e){if(e)for(let t=0;t<e.length;t++){let r=null;r="FORMPOSTINPUT"===e[t].type||"FORMPOSTINPUT"===e[t].data.type||"FORMPOSTINPUT"===e[t].attributes.type?new FORMPOSTINPUT(this.form.fieldset.formElementGroup.body.pane,e[t]):new FORMINPUT(this.form.fieldset.formElementGroup.body.pane,e[t]),this.form.fieldset.formElementGroup.children.push(r)}}editAttributes(){console.log("editattributes");let e=parseInt(this.input.attributes.value),t=[new MODEL(new ATTRIBUTES({name:"id",value:e})).set({element:"INPUT",type:"FORMPOST",label:"id"})];try{$.getJSON("/FORMPOST/Get/"+e,e=>{e.model?e.model.jsonResults&&("undefined"==typeof container?console.log("Unable to retrieve parent container"):(t=this.createInputArray(JSON.parse(e.model.jsonResults),this.getContainer(),t),this.destroyForm(),this.createFormPostForm(t,e))):(console.log(0,"An Exception Occurred",e.message),this.getMainContainer().login())})}catch(e){console.log(0,"Unable to retrieve FormPost.",e)}}createInputArray(e,t,r){return e.forEach(({name:e,value:o})=>{"id"!==e&&r.push(new MODEL(new ATTRIBUTES({name:e,value:this.getContainerProperty(t)||o})).set({element:"INPUT",label:e}))}),r}getContainerProperty(e,t){let r=e[t],o=null;return r&&r.el&&(o=r.el.innerHTML),o}destroyForm(){try{this.form.destroy()}catch(e){console.warn("Unable to destroy pre-existing form",e)}return this}createFormPostForm(e,t){return this.form=FORM.createEmptyForm(),this.form.label="Modify",this.form.fieldset.formElementGroup.label="Attributes",this.form.fieldset.formElementGroup.navBar.header.menu.getGroup("ELEMENTS").empty(),this.addFormElementGroupContainerCase(["INPUT","SELECT","TEXTAREA"]),this.addInputs(e),this.form.fieldset.formElementGroup.toggleHeaders(),this.form.setPostUrl("FormPost/Set"),this.form.afterSuccessfulPost=(()=>{this.updateInput(t.model.id)}),this.form}addFormElementGroupContainerCase(e){for(let t=0;t<e.length;t++)this.form.fieldset.formElementGroup.addContainerCase(e[t])}}export{ATTRIBUTES,EL,MODEL};
//# sourceMappingURL=FORMPOSTINPUT.js.map

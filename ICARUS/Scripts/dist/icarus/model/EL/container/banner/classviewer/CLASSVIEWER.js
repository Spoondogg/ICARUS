import FORM,{ATTRIBUTES,MODEL}from"../../../form/FORM.js";import BANNER from"../BANNER.js";import HEADER from"../../../header/HEADER.js";import MENULIST from"../../menulist/MENULIST.js";export default class CLASSVIEWER extends BANNER{constructor(e,s){super(e,s),this.addClass("classviewer"),this.classType="JUMBOTRON"}construct(){this.h1=new HEADER(this.body.pane,(new MODEL).set({label:this.classType+" viewer"}),1),this.form=FORM.createEmptyForm(this.body.pane);let e=[new MODEL(new ATTRIBUTES({name:"classType",value:this.classType,readonly:"readonly"})).set({element:"INPUT",label:"Class Type"})];this.form.fieldset.formElementGroup.addInputElements(e),this.menulist=new MENULIST(this.body.pane,new MODEL(new ATTRIBUTES({style:"max-height:200px;overflow-y:auto;"})).set({name:"preview-list",label:this.data.listClass+"(s)"}));let s=["Index","List","Count","Page","PageIndex","GetContainerParents"];for(let e=0;e<s.length;e++)this.menulist.menu.addNavItem((new MODEL).set({label:this.classType+"."+s[e]+"()"})).el.onclick=(()=>{window.open(new URL(window.location.href).origin+"/"+this.classType+"/"+s[e])})}}
//# sourceMappingURL=CLASSVIEWER.js.map
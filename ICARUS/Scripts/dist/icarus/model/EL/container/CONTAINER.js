import GROUP,{ATTRIBUTES,EL,MODEL}from"../group/GROUP.js";import AbstractMethodError from"../../../error/AbstractMethodError.js";import CONTAINERBODY from"./CONTAINERBODY.js";import{DATAELEMENTS}from"../../../enums/DATAELEMENTS.js";import DATEOBJECT from"../../../helper/DATEOBJECT.js";import DIALOG from"../dialog/DIALOG.js";import DIV from"../div/DIV.js";import FOOTER from"../footer/FOOTER.js";import HEADER from"../header/HEADER.js";import{ICONS}from"../../../enums/ICONS.js";import{INPUTTYPES}from"../../../enums/INPUTTYPES.js";import NAVBAR from"../nav/navbar/NAVBAR.js";import{STATUS}from"../../../enums/STATUS.js";import STRING from"../../../STRING.js";export default class CONTAINER extends GROUP{constructor(e,t,s=(new MODEL).set({element:t,name:t||"",label:t,shared:1}),a=[]){super(e,t,s),this.addClass("icarus-container"),this.dataElements=DATAELEMENTS[this.className],this.attrElements=[],this.shared=this.shared||1,this.updateUrl=this.element+"/Set",this.subsections=s.subsections?s.subsections.split(","):"0",this.navBar=this.createDraggableNavBar(),this.body=new CONTAINERBODY(this,s),this.addNavBarDefaults(),this.addDefaultContainers(a),this.setDefaultVisibility(s),this.construct()}construct(){if("CONTAINER"!==this.className)throw new AbstractMethodError("CONTAINER{"+this.className+"} : Abstract method "+this.className+".construct() not implemented.")}getToken(){return document.getElementsByTagName("meta").token.content}save(e,t=this){throw console.log(e,t),new AbstractMethodError("CONTAINER{"+this.className+"} : Abstract method "+this.className+".construct() not implemented.")}quickSave(e,t=!1){throw console.log(e,t),new AbstractMethodError("CONTAINER{"+this.className+"} : Abstract method "+this.className+".construct() not implemented.")}setDefaultVisibility(e){this.expand(),e.dataId>0&&(e.data.collapsed&&this.collapse(),e.data.showNavBar&&this.showNavBar())}addDefaultContainers(e){e.splice(2,0,...["IFRAME","FORM","LIST","MENULIST","JUMBOTRON","BANNER","PARAGRAPH","CHAT"]);for(let t=0;t<e.length;t++)this.addContainerCase(e[t])}createDraggableNavBar(){let e=new NAVBAR(this,(new MODEL).set({label:this.label}));return e.el.setAttribute("draggable",!0),e.el.ondragstart=(e=>{console.log("Dragging Container: "+this.className+"("+this.id+") "+this.label),this.collapse(),e.dataTransfer.setData("Container",this.id)}),e.el.ondrop=(e=>{console.log("Dropping onto Container: "+this.className+"("+this.id+")"),e.preventDefault();let t=$(document.getElementById(e.dataTransfer.getData("Container")));t.insertBefore(this.el),t.collapse("show")}),e.el.ondragover=(e=>{e.preventDefault()}),e.el.ondragend=(()=>{}),e}htmlEncode(e){return $("<div/>").text(e).html()}htmlDecode(e){return $("<div/>").html(e).text()}moveUp(){console.log("Move Up");let e=$(this.el);return e.prev().length>0&&(e.animate({height:"toggle"},300),setTimeout(()=>{e.prev().animate({height:"toggle"},300).insertAfter(e).animate({height:"toggle"},300)},0),setTimeout(()=>{e.animate({height:"toggle"},300).delay(300)},300)),this}moveDown(){console.log("Move Down");let e=$(this.el);return e.next().length>0&&(e.animate({height:"toggle"},300),setTimeout(()=>{e.next().animate({height:"toggle"},300).insertBefore(e).animate({height:"toggle"},300).delay(300)},0),setTimeout(()=>{e.animate({height:"toggle"},300)},300)),this}refresh(){console.log(0,"Refreshing CONTAINER{"+this.className+"}["+this.id+"]"),this.body.pane.empty(),this.construct(),this.populate(this.body.pane.children)}showNavBar(){$(this.navBar.el).collapse("show")}addDomItems(){let e=this.navBar.menu.menu.getGroup("DOM");return e.addNavItemIcon((new MODEL).set({icon:ICONS.UP,label:"UP"})).el.onclick=this.moveContainerUp.bind(this),e.addNavItemIcon((new MODEL).set({icon:ICONS.DOWN,label:"DOWN"})).el.onclick=this.moveContainerDown.bind(this),e.addNavItemIcon((new MODEL).set({icon:ICONS.REFRESH,label:"REFRESH"})).el.onclick=this.refresh.bind(this),e.addNavItemIcon((new MODEL).set({icon:ICONS.DELETE,label:"REMOVE"})).el.onclick=this.remove.bind(this),e.addNavItemIcon((new MODEL).set({icon:ICONS.EXCLAMATION,label:"DELETE"})).el.onclick=this.disable.bind(this),e}addCrudItems(){let e=this.navBar.menu.menu.getGroup("CRUD");return e.addNavItemIcon((new MODEL).set({icon:ICONS.LOAD,label:"LOAD"})).el.onclick=this.load.bind(this),e}addNavBarDefaults(){if(this.navBar.menu.menu){this.addDomItems();let e=this.addCrudItems();this.btnSave=e.addNavItemIcon((new MODEL).set({icon:ICONS.SAVE,label:"SAVE"})),this.btnSave.el.onclick=this.createWrappedSaveForm.bind(this),this.btnQuickSave=e.addNavItemIcon((new MODEL).set({icon:ICONS.SAVE,label:"QUICKSAVE"})),this.btnQuickSave.el.onclick=this.quickSave.bind(this)}}moveContainerUp(){this.navBar.menu.toggleCollapse(),this.moveUp()}moveContainerDown(){this.navBar.menu.toggleCollapse(),this.moveDown()}createWrappedSaveForm(){if(this.btnSave.toggle("active"),$(this.btnSave.el).hasClass("active")){let e=this.navBar.menu.menu.getGroup("CRUD").wrapper;this.btnSave.wrapper=new DIV(e,new MODEL(new ATTRIBUTES("collapse in wrapper"))),this.save(this.btnSave.wrapper,this)}else{console.log(0,"Closing "+this.className+".save() form.");let e=this.navBar.menu.menu.getGroup("CRUD").el.nextElementSibling;try{$(e).collapse("toggle"),setTimeout(()=>{e.parentNode.removeChild(e)},2e3)}catch(e){console.log("Unable to destroy this",e)}}}ajax(e,t,s){return $.ajax({url:e,type:t,async:!0,data:s,success:e=>e})}addConstructElementButton(e){this.navBar.menu.menu&&(this.navBar.menu.menu.getGroup("ELEMENTS").addNavItemIcon((new MODEL).set({icon:ICONS[e],label:e})).el.onclick=(()=>{this.navBar.menu.toggleCollapse(),new Promise((t,s)=>{console.log("Promise");let a=this.create((new MODEL).set({className:e}));console.log("Promise",a),null===a?s(Error("Failed to create element")):t(a)}).then(e=>{console.log("promise success",e),this.quickSave(!0)},e=>{console.log("promise fail",e)})}))}addContainerCase(e,t=!0){try{void 0!==this.getMainContainer()&&(this.addCase(e,function(t){console.log(this.className+": CALLING CASE: "+e);try{return this.getMainContainer().getFactory().get(this.body.pane,e,t.id||0)}catch(e){console.warn("Unable to retrieve factory for Container Case",e)}}.bind(this)),t&&this.addConstructElementButton(e))}catch(e){console.warn(this.className+": Unable to add Container Case",e)}}open(){try{this.status=STATUS.OPEN,super.open(),this.el.setAttribute("data-status","open"),this.header.btnLock.icon.el.className=ICONS.UNLOCK,this.header.options.el.removeAttribute("disabled")}catch(e){console.log("Unable to open parent.",e)}}close(){console.log("Locking "+this.element+"("+this.getId()+")"),this.status=STATUS.CLOSED,this.node.close(),this.el.setAttribute("data-status","closed"),console.log(this.element+" has "+this.children.length+" child(ren)");for(let e=0;e<this.children.length;e++)this.children[e].status===STATUS.OPEN&&this.children[e].close();console.log("Children are closed. Closing "+this.element+"("+this.getId()+")"),this.header.btnLock.icon.el.className=ICONS.LOCK,$(this.header.btnLock.el).removeClass("active"),this.header.options.el.setAttribute("disabled","disabled"),console.log("Locked")}getId(){return this.el.getAttribute("id")}setId(e){this.id=e,this.el.setAttribute("id",e),this.data.id=e,this.attributes.id=e}getName(){return this.el.getAttribute("name")}setName(e){this.el.setAttribute("name",e),this.model.name=e}collapse(){try{return $(this.body.el).collapse("hide"),!0}catch(e){return console.log(e),!1}}expand(){try{$(this.body.el).collapse("show")}catch(e){console.warn(e)}}toggleBody(){$(this.body.el).collapse("toggle")}load(){throw new AbstractMethodError("CONTAINER{"+this.className+"}.load() : Abstract method "+this.className+".load() not implemented.")}getSubSections(){let e=null,t=[];for(let s=0;s<this.body.pane.el.children.length;s++)e=parseInt(this.body.pane.el.children[s].id),isNaN(e)||t.push(e);return t}getContainer(){return this.container}getMainContainer(){try{return this.getProtoTypeByClass("MAIN")}catch(e){switch(this.getProtoTypeByClass("MODAL").className){case"LOADER":console.warn("Modals exist in body.document and do not have a parent Container");break;default:console.log(this.className+" does not have a parent Container.",this,this.getProtoTypeByClass("MODAL"))}}}getPrompt(){try{return this.getMainContainer().prompt}catch(e){throw console.warn("Unable to retrieve the application prompt"),e}}quickSaveParent(){try{return this.container.quickSave(!1)}catch(e){return console.log("Container.QuickSaveParent() No parent exists"),!1}}afterSuccessfulPost(e,t){console.log(100,"Successful Post",e,t)}getLabel(){return this.header.getLabel()}setLabel(e){this.navBar.menu.tab.anchor.setInnerHTML(e),this.label=e}setSubSections(e){this.model.subsections=e}toggleHeaders(){alert("CONTAINER.toggleHeaders()")}remove(){try{new DIALOG((new MODEL).set({label:"Remove "+this.className+"{"+this.element+"}["+this.id+"]",text:"Remove "+this.className+" from "+this.node.node.node.className+"?",token:this.getMainContainer().getToken()})).show()}catch(e){console.log("Unable to disable this "+this.element,e)}}ajaxRefreshIfSuccessful(e,t){if(e.result){let e=new URL(window.location.href),t=e.searchParams.get("ReturnUrl");t?location.href=e.origin+t:location.reload(!0)}else console.log('Login Failed.  Unable to POST results to server with status: "'+t+'"',e)}disable(){}getDateCreated(){return DATEOBJECT.getDateObject(new STRING(this.dateCreated).getDateValue(this.dateCreated))}}export{ATTRIBUTES,DATAELEMENTS,DATEOBJECT,DIALOG,EL,FOOTER,HEADER,ICONS,INPUTTYPES,MODEL,STRING};
//# sourceMappingURL=CONTAINER.js.map

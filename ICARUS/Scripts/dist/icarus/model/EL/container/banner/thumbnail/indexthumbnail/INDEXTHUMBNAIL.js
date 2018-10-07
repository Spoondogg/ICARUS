import"../../../../../../StringMethods.js";import CONTAINER,{ATTRIBUTES,EL,MODEL}from"../../../CONTAINER.js";import HEADER from"../../../../header/HEADER.js";import IMG from"../../../../img/IMG.js";import MENULIST from"../../../menulist/MENULIST.js";import MODAL from"../../../../modal/MODAL.js";import P from"../../../../p/P.js";import THUMBNAIL from"../THUMBNAIL.js";export default class INDEXTHUMBNAIL extends THUMBNAIL{constructor(e,t){super(e,t),this.setClass("col-xs-12 col-vs-6 col-sm-6 col-md-4 col-lg-offset-0")}launchModal(){console.log("Launch Index Thumbnail Modal"),this.addModal(),this.addDataListNavItems(),this.modal.show()}addModal(){return this.modal=new MODAL(this.data.header),this.modal.container.body.pane.addClass("thumbnail index-thumbnail"),this.modal.container.image=new IMG(this.modal.container.body.pane,new MODEL(new ATTRIBUTES({src:this.image.el.src}))),this.modal.container.header=new HEADER(this.modal.container.body.pane,(new MODEL).set({label:this.data.header})),this.modal.container.p=new P(this.modal.container.body.pane,new MODEL(new ATTRIBUTES({style:"height:auto;"})),this.data.p),this.modal.container.previewNotes=new EL(this.modal.container.body.pane,"DIV",new MODEL(new ATTRIBUTES({class:"preview-notes"})),""),this.modal.container.preview=new CONTAINER(this.modal.container.body.pane,"DIV",new MODEL(new ATTRIBUTES("preview")),[this.data.listClass.toUpperCase()]),this.modal.container.menulist=new MENULIST(this.modal.container.body.pane,new MODEL("index-thumbnail-menulist").set({name:"preview-list",label:this.data.listClass+"(s)"})),this.modal}addDataListNavItems(){for(let e=0;e<this.data.list.length;e++){let t=this.data.list[e].label+" ("+this.data.listClass+"["+this.data.list[e].id+"])";this.modal.container.menulist.menu.addNavItem((new MODEL).set({label:t})).el.onclick=(()=>{this.modal.container.preview.body.pane.empty(),this.launchPreview(500,t,this.modal.container.preview.body.pane,this.data.listClass,this.data.list[e].id)})}}launchPreview(e=500,t,a){setTimeout(()=>{$.getJSON("/"+t+"/Get/"+a,e=>{console.log(t,e),this.modal.container.preview.create(e.model)})},e),setTimeout(()=>{$.getJSON("/"+t+"/GetContainerParents/"+a,e=>{console.log(t+" Parents:",e,e.length+" parent Containers"),this.modal.container.previewNotes.el.innerHTML="Parent Containers: "+e.length})},e)}}
//# sourceMappingURL=INDEXTHUMBNAIL.js.map

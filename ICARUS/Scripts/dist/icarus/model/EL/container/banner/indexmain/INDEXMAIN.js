import BANNER from"../BANNER.js";import BUTTON from"../../../button/BUTTON.js";import BUTTONGROUP from"../../../group/buttongroup/BUTTONGROUP.js";import FOOTER from"../../../footer/FOOTER.js";import HEADER from"../../../header/HEADER.js";import MENU from"../../../nav/menu/MENU.js";import MODEL from"../../../../MODEL.js";import THUMBNAIL from"../thumbnail/THUMBNAIL.js";export default class INDEXMAIN extends BANNER{constructor(t,e){super(t,e),this.addClass("index-main"),this.page=0,this.pageLength=6,this.pageTotal=0,this.menu=new MENU(this,(new MODEL).set({label:"INDEX"})),this.header=new HEADER(this,new MODEL),$(this.header.el).insertBefore(this.body.pane.el),this.pagination=this.createPaginationFooter(),this.footer=new FOOTER(this,new MODEL),$(this.pagination.el).insertAfter(this.body.pane.el),this.loadPage(this.page)}construct(){isNaN(this.page)||(console.log("Retrieving page "+this.page),$.post("/Main/PageIndex?page="+this.page+"&pageLength="+this.pageLength,{__RequestVerificationToken:this.getMainContainer().token},(t,e)=>{if("success"===e&&(this.pageTotal=t.total,t.list.forEach(e=>{this.createThumbnail(e,t.className)}),!this.pagination.buttonGroup.loaded)){console.log("Page Total: "+this.pageTotal+", Length: "+this.pageLength),this.pageCount=Math.ceil(this.pageTotal/this.pageLength),console.log("PageCount: "+this.pageCount+", ("+this.pageTotal/this.pageLength+")");for(let t=0;t<this.pageCount;t++){this.pagination.buttonGroup.addButton(t+1).el.onclick=(()=>{this.loadPage(t)})}this.pagination.buttonGroup.loaded=!0}}))}createThumbnail(t,e){let a=new THUMBNAIL(this.body.pane,(new MODEL).set({label:t.label,dataId:-1,data:{header:t.label,p:"Launch "+t.label+" ("+t.id+")<br>"+e+"["+t.index+"]"}}));return a.el.onclick=(()=>{this.launchMain(t.id,t.label)}),a}createPaginationFooter(){let t=new FOOTER(this,new MODEL("pagination"));return t.el.setAttribute("style","text-align:center;"),t.btnPrev=new BUTTON(t,"Prev"),t.btnPrev.el.setAttribute("style","margin-right:1em;"),t.btnPrev.el.onclick=this.prevPage.bind(this),t.buttonGroup=new BUTTONGROUP(t),t.buttonGroup.loaded=!1,t.btnNext=new BUTTON(t,"Next"),t.btnNext.el.setAttribute("style","margin-left:1em;"),t.btnNext.el.onclick=this.nextPage.bind(this),t}launchMain(t){this.getMainContainer().load(t)}loadPage(t){try{this.header.setInnerHTML("Page "+(t+1));let e=this.pagination.buttonGroup.el.children;for(let t=0;t<e.length;t++)$(e[t]).removeClass("active");$(e[t]).addClass("active"),this.body.pane.empty(),this.page=t,this.construct()}catch(t){console.log("Unable to load page.",t)}}nextPage(){this.pageTotal>this.page*this.pageLength+1?this.loadPage(this.page+1):console.log("No next pages to display")}prevPage(){this.page>0?this.loadPage(this.page-1):console.log("No previous pages to display")}}
//# sourceMappingURL=INDEXMAIN.js.map
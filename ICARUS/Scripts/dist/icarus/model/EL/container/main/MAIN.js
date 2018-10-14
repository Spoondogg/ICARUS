import CONTAINER,{DIALOG,ICONS,MODEL}from"../CONTAINER.js";import FORM from"../../form/FORM.js";import LOADER from"../../modal/loader/LOADER.js";import NAVITEMICON from"../../nav/navitemicon/NAVITEMICON.js";import SIDEBAR from"../sidebar/SIDEBAR.js";import STICKYFOOTER from"../../footer/stickyfooter/STICKYFOOTER.js";export default class MAIN extends CONTAINER{constructor(e){document.title=e.label,super(document.body,"MAIN",e,["ARTICLE","INDEX","INDEXMAIN","CLASSVIEWER","IMAGEGALLERY","DICTIONARY","WORD"]),this.addClass("app").navBar.addClass("navbar-fixed-top"),this.body.pane.addClass("pane-tall"),this.factory=e.factory,this.loader=e.loader,this.token=e.token,this.url=e.url,this.sidebar=new SIDEBAR(this,(new MODEL).set({label:"Left Sidebar"})),this.addNavOptions(),this.stickyFooter=new STICKYFOOTER(this,new MODEL),this.populate(e.children)}construct(){this.navBar.el.setAttribute("draggable","false"),this.showNavBar(),"Guest"===this.user&&(this.btnLogin=this.navBar.menu.tabs.addNavItemIcon(new MODEL("pull-right").set({icon:ICONS.USER,label:"LOG IN"})),this.btnLogin.el.onclick=this.login.bind(this))}isDev(){return this.dev}getUser(){return this.user}getFactory(){return this.factory}addNavOptions(){return this.navBar.menu.menu&&(this.btnSidebar=this.navBar.menu.tabs.addNavItemIcon(new MODEL("pull-left").set({icon:ICONS.SIDEBAR})),this.btnSidebar.el.onclick=this.toggleSidebar.bind(this),$(this.btnSidebar.el).insertBefore(this.navBar.menu.tab.el),this.body.el.onclick=this.focusBody.bind(this),this.addDefaultMenuItems()),this}addNavItemIcon(e,t,o="",s="#"){return e.addNavItemIcon((new MODEL).set({icon:t,label:o,url:s}))}addDefaultMenuItems(){let e=this.navBar.menu.menu.addMenu(new MODEL("horizontal collapse").set({name:"USER",showHeader:1,collapsed:1}));this.addNavItemIcon(e,ICONS.USER,"Log Out","#?url=logout").el.onclick=(()=>{this.navBar.menu.toggleCollapse(),this.logout()}),this.addNavItemIcon(e,ICONS.OPTIONS,"Manage","Manage/Index");let t=this.navBar.menu.menu.getGroup("DOM");this.addNavItemIcon(t,ICONS.HOME,"Home").el.onclick=(()=>{setTimeout(()=>{location.href=this.url.origin},300)}),this.addNavItemIcon(t,ICONS.TOGGLE,"Headers").el.onclick=(()=>{this.toggleHeaders(),this.navBar.menu.toggleCollapse()}),this.addNavItemIcon(t,ICONS.CONSOLE,"Console").el.onclick=(()=>{this.loader.show(),this.loader.showConsole()}),this.addNavItemIcon(t,ICONS.REFRESH,"Reload").el.onclick=(()=>{setTimeout(()=>{location.reload(!0)},1e3)});let o=this.navBar.menu.menu.getGroup("CRUD");this.addNavItemIcon(o,ICONS.MAIN,"New").el.onclick=this.newMain.bind(this)}newMain(){$.getJSON("/MAIN/Get/0",e=>(console.log("Created MAIN",e),!0))}getContainer(){return this}getMainContainer(){return this}focusBody(){$(this.sidebar.el).hasClass("active")&&this.sidebar.removeClass("active"),$(this.navBar.menu.menu.el).collapse("hide")}load(e=1){let t=this.url.searchParams.get("ReturnUrl");return t&&(t=this.url.origin+t,location.href=t),$.getJSON("Main/Get/"+e,this.loadAjaxCall.bind(this)),this}loadAjaxCall(e){if(1===e.result)try{return e.model.label&&(document.title=e.model.label),this.body.pane.empty(),this.setId(this.id),this.setLabel(e.model.label),this.populate(e.model.children),!0}catch(e){throw console.log(0,"Unable to construct "+this.className+"("+this.id+")"),e}else this.loader.log(0,"Failed to retrieve "+this.className+"("+this.id+") from server\n"+e.message),this.loader.showConsole()}toggleSidebar(){return this.sidebar.toggle("active"),this}open(e=0){return console.log("TODO: APP.open("+e+")"),!1}getId(){return this.id}loginExternal(){console.log("loginExternal()")}login(){let e=new DIALOG((new MODEL).set({text:"Log In"})),t=FORM.createEmptyForm(this.body.pane);$(t.el).appendTo(e.body.el),t.setPostUrl("/Account/Login"),t.id=0,t.label="Login",t.el.setAttribute("id",0),t.el.setAttribute("class","login"),t.el.setAttribute("method","POST"),t.el.setAttribute("action","#"),t.children[0].children[0].addInputElements([FORM.createInputModel("INPUT","Email","Email / Username","","EMAIL"),FORM.createInputModel("INPUT","Password","Password","","PASSWORD"),FORM.createInputModel("INPUT","RememberMe","Remember Me","","CHECKBOX")]),t.footer.buttonGroup.addButton("Register").el.onclick=this.register,t.afterSuccessfulPost=((e,t)=>{this.ajaxRefreshIfSuccessful(e,t)}),e.show()}createExternalLoginForm(){let e=FORM.createEmptyForm(this.prompt.container.body.pane);return e.el.setAttribute("method","post"),e.el.setAttribute("action","/Account/ExternalLogin"),e.footer.buttonGroup.children[0].el.style.display="none",e}logout(){this.loader.showConsole(),this.loader.log(50,"MAIN.logout(); Logging out...",!0),$.post("/Account/LogOff",{__RequestVerificationToken:this.token},this.ajaxRefreshIfSuccessful,"json")}register(){console.log("Register")}registerExternal(){console.log("Register External Login")}}export{LOADER,MODEL,NAVITEMICON};
//# sourceMappingURL=MAIN.js.map

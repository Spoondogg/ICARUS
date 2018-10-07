import CONTAINER,{MODEL}from"../CONTAINER.js";import MENU,{LI,UL}from"../../nav/menu/MENU.js";export default class MENULIST extends CONTAINER{constructor(e,s){super(e,"DIV",s,[]),this.addClass("menulist")}construct(){this.menu=new MENU(this.body.pane,new MODEL("menulist-menu").set({label:this.label}))}}export{LI,MENU,UL};
//# sourceMappingURL=MENULIST.js.map

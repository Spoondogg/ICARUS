import UL,{ATTRIBUTES,LI,MODEL}from"../../ul/UL.js";import DIV from"../../div/DIV.js";import HEADER from"../../header/HEADER.js";import NAVITEM from"../navitem/NAVITEM.js";import NAVITEMICON from"../navitemicon/NAVITEMICON.js";import NAVSEPARATOR from"../navitem/NAVSEPARATOR.js";export default class MENU extends UL{constructor(e,t){super(e,t),this.addClass("list"),this.wrapper=new DIV(e,new MODEL("menu")),t.showHeader&&(this.header=new HEADER(this.wrapper,(new MODEL).set({label:t.label||t.name||"__Unknown"}))),$(this.el).appendTo(this.wrapper.el),t.showHeader&&(this.header.el.onclick=(()=>{$(this.el).collapse("toggle")})),this.addCase("MENU",()=>this.addMenu(t)),this.addCase("NAVITEM",()=>this.addNavItem(t)),this.addCase("NAVITEMICON",()=>this.addNavItemIcon(t)),this.addCase("NAVSEPARATOR",()=>this.addNavSeparator())}toggleCollapse(){$(this.el).collapse("toggle")}hide(){try{return $(this.collapse.el).collapse("hide"),!0}catch(e){return console.log(e),!1}}show(){try{$(this.collapse.el).collapse("show")}catch(e){console.log(e)}}addMenu(e){return this.children.push(new MENU(this,e)),this.addGroup(this.children[this.children.length-1])}addNavItem(e){return this.children.push(new NAVITEM(this,e)),this.addGroup(this.children[this.children.length-1])}addNavItemIcon(e){return this.children.push(new NAVITEMICON(this,e)),this.addGroup(this.children[this.children.length-1])}addNavItems(e){for(let t=0;t<e.length;t++)this.addNavItem(e[t])}addNavSeparator(){return new NAVSEPARATOR(this)}setActive(){try{return $(".dropdown-tab").removeClass("active"),$(this).toggleClass("active"),!0}catch(e){return console.log("Unable to set this Item Group as active",e),!1}}}export{ATTRIBUTES,LI,MODEL,UL};
//# sourceMappingURL=MENU.js.map
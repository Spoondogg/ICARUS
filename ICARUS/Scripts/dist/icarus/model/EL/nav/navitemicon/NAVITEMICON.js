import MENU from"../menu/MENU.js";import NAVITEM,{ANCHOR}from"../navitem/NAVITEM.js";export default class NAVITEMICON extends NAVITEM{constructor(t,e){super(t,e),this.addClass("nav-item-icon"),this.el.setAttribute("title",e.anchor.label)}addMenu(t){return this.children.push(new MENU(this,t)),this.children[this.children.length-1]}}
//# sourceMappingURL=NAVITEMICON.js.map

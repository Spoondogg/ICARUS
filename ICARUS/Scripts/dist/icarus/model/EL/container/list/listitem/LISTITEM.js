import CONTAINER,{MODEL}from"../../CONTAINER.js";import P from"../../../p/P.js";export default class LISTITEM extends CONTAINER{constructor(t,s){super(t,"LI",s,["LIST"]),this.populate(s.children)}construct(){(this.dataId>0||-1===this.dataId)&&this.data.p&&(this.p=new P(this.body.pane,new MODEL,this.htmlDecode(this.data.p)))}}
//# sourceMappingURL=LISTITEM.js.map

import JUMBOTRON,{ATTRIBUTES,MODEL}from"../JUMBOTRON.js";import GLYPHICON from"../../../span/GLYPHICON.js";import HEADER from"../../../header/HEADER.js";import{ICONS}from"../../../../../enums/ICONS.js";import P from"../../../p/P.js";export default class HEADERWRAP extends JUMBOTRON{constructor(e,r){super(e,r),this.addClass("headerwrap"),this.header=new HEADER(this.body.pane,new MODEL(new ATTRIBUTES("clearfix"))),this.header.h1=new HEADER(this.header,(new MODEL).set({label:"Hello World"}),1),this.header.h1.icon=new GLYPHICON(this.header.h1,ICONS.PLUS),this.header.p=new P(this.header,new MODEL,"Woot to the Woot"),this.populate(r.children)}}
//# sourceMappingURL=HEADERWRAP.js.map

import DIV,{MODEL}from"../div/DIV.js";export default class CONTAINERBODY extends DIV{constructor(s,e){super(s,e),this.setClass("container-body collapse in"),this.pane=new DIV(this,new MODEL("pane")),this.pane.el.addEventListener("touchstart",this.handleTouchStart,{passive:!0}),this.pane.el.addEventListener("touchmove",this.handleTouchMove,{passive:!0}),this.xDown=null,this.yDown=null}handleTouchStart(s){this.xDown=s.touches[0].clientX,this.yDown=s.touches[0].clientY}handleTouchMove(s){if(this.xDown&&this.yDown){var e=s.touches[0].clientX,t=s.touches[0].clientY,o=this.xDown-e,l=this.yDown-t;Math.abs(o)>Math.abs(l)?o>0?console.log(this.className+"left swipe"):console.log(this.className+"right swipe"):l>0?console.log(this.className+" up swipe"):console.log(this.className+" down swipe"),this.xDown=null,this.yDown=null}}collapse(){$(this.el).collapse("toggle")}}
//# sourceMappingURL=CONTAINERBODY.js.map

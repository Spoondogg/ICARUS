import CONTAINER,{ATTRIBUTES,EL,FORM,MODEL}from"../CONTAINER.js";export default class CHAT extends CONTAINER{constructor(e,t){super(e,"DIV",t,[]),this.addClass("chat"),this.user=this.getMainContainer().getUser(),this.form=FORM.createEmptyForm(this.body.pane),this.form.el.style="height:68px;background-color:#5a5a5a;",$(this.form.el).insertAfter(this.body.pane.el);let n=[new MODEL(new ATTRIBUTES({name:"statement",type:"TEXTAREA",value:""})).set({element:"TEXTAREA",label:"element"})];this.form.fieldset.formElementGroup.addInputElements(n),this.form.setPostUrl("CHAT/Talk"),this.form.afterSuccessfulPost=function(e){setTimeout(()=>{this.addStatement("ICARUS",e.message)},1e3)}.bind(this),this.chatInput=this.form.fieldset.formElementGroup.children[0].input,console.log("Chat Input",this.chatInput),this.chatInput.el.onkeypress=this.postStatement.bind(this)}postStatement(){return 13!==window.event.keyCode||(this.addStatement(this.user,this.chatInput.el.value),this.form.post(),this.chatInput.el.value="",!1)}addStatement(e,t){let n=new EL(this.body.pane,"DIV",new MODEL("statement"));return n.el.style.display="none",n.thumb=new EL(n,"DIV",new MODEL(new ATTRIBUTES({class:"thumb"}))),n.thumb.img=new EL(n.thumb,"IMG",new MODEL(new ATTRIBUTES({class:"user-photo",src:"https://ssl.gstatic.com/accounts/ui/avatar_2x.png"}))),n.bubble=new EL(n,"DIV",new MODEL(new ATTRIBUTES({class:"bubble"}))),n.bubble.panel=new EL(n.bubble,"DIV",new MODEL("panel panel-default")),n.bubble.panel.heading=new EL(n.bubble.panel,"DIV",new MODEL("panel-heading")),n.bubble.panel.heading.strong=new EL(n.bubble.panel.heading,"STRONG",new MODEL,e),n.bubble.panel.heading.cite=new EL(n.bubble.panel.heading,"CITE",new MODEL,"commented X mins ago"),n.bubble.panel.body=new EL(n.bubble.panel,"DIV",new MODEL("panel-body"),t),$(n.el).fadeIn(500),$(this.body.pane.el).animate({scrollTop:$(this.body.pane.el).prop("scrollHeight")},1e3),n}construct(){setTimeout(()=>{this.addStatement("ICARUS","Hello "+this.user)},2e3)}}
//# sourceMappingURL=CHAT.js.map

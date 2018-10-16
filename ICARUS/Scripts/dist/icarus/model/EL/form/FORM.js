import CONTAINER,{ATTRIBUTES,ICONS,INPUTTYPES,MODEL}from"../container/CONTAINER.js";import FIELDSET from"../fieldset/FIELDSET.js";import FORMFOOTER from"./FORMFOOTER.js";import FORMINPUT from"../container/formelement/forminput/FORMINPUT.js";import FORMINPUTTOKEN from"../container/formelement/forminput/forminputtoken/FORMINPUTTOKEN.js";import FORMPOST from"./FORMPOST.js";export default class FORM extends CONTAINER{constructor(e,t){super(e,"FORM",t,["FIELDSET"]),this.addCase("FIELDSET",()=>this.addFieldset(t)),this.tokenInput=new FORMINPUTTOKEN(this,(new MODEL).set({value:this.getToken()})),this.setPostUrl("Form/Submit"),this.updateUrl="Form/Update",this.footer=new FORMFOOTER(this.body,new MODEL),this.footer.buttonGroup.addButton("Submit",ICONS.SAVE).el.onclick=this.post.bind(this),this.populate(t.children)}construct(){}addFieldset(e){return this.children.push(new FIELDSET(this.body.pane,e)),this.addGroup(this.children[this.children.length-1])}static createEmptyForm(e,t=!1){let s=new FORM(e,new MODEL(new ATTRIBUTES({style:t?"display:none;":""})).set({label:"FORM"}));return s.addFieldset(new MODEL).addFormElementGroup(new MODEL),s}setPostUrl(e){return this.postUrl=e,this}lock(){try{for(let e=0;e<this.children.length;e++)this.children[e].el.disabled=!0;return!0}catch(e){throw console.log("Unable to lock this form"),e}}unlock(){for(let e=0;e<this.children.length;e++)try{this.children[e].el.disabled=!1}catch(t){if(!(t instanceof TypeError))throw t;console.warn('Unable to lock "'+this.children[e].element+'"')}}htmlEncodeValues(){try{for(let e=0;e<this.el.elements.length;e++)"TEXT"!==this.el.elements[e].type.toUpperCase()&&"TEXTAREA"!==this.el.elements[e].type.toUpperCase()||(this.el.elements[e].value=this.htmlEncode(this.el.elements[e].value))}catch(e){throw console.log("FORM.htmlEncodeValues() failed."),e}}setInvalid(e){this.payload.isValid=!1,e.focus(),e.setAttribute("data-valid",this.payload.isValid),$(e.previousSibling).addClass("invalid")}validate(){this.htmlEncodeValues(),this.payload={isValid:!0,formName:this.el.name};for(let e=0;e<this.el.elements.length;e++)switch(this.el.elements[e].type){case"input":case"text":case"email":case"tel":case"password":if(this.el.elements[e].checkValidity()){""===this.el.elements[e].value?this.setInvalid(this.el.elements[e]):($(this.el.elements[e]).removeClass("invalid"),this.el.elements[e].setAttribute("data-valid",this.payload.isValid));break}console.log(this.el.elements[e].name+" -- isValid: "+this.el.elements[e].checkValidity()),this.setInvalid(this.el.elements[e]);break;case"checkbox":if(this.el.elements[e].required&&!this.el.elements[e].checked){this.setInvalid(this.el.elements[e]);break}break;case"select-one":0===this.el.elements[e].selectedIndex?this.setInvalid(this.el.elements[e]):($(this.el.elements[e]).removeClass("invalid"),this.el.elements[e].setAttribute("data-valid",this.payload.isValid));break;default:console.warn("Unable to validate unidentified form element type.")}return console.log("Validation Result: "+this.payload.isValid),this.payload}reset(){console.log("Resetting form["+this.el.name+"]");for(let e=0;e<this.el.elements.length;e++)this.el.elements[e].removeAttribute("data-valid"),$(this.el.elements[e].previousSibling).removeClass("invalid");this.el.reset()}getResultsAsArray(){return console.log("FORM.getResultsAsArray()"),$(this.el).serializeArray()}getFormPost(){return this.validate().isValid?new FORMPOST(this):null}static createInputModel(e,t,s,l="",i="TEXT"){return new MODEL(new ATTRIBUTES({name:t,value:l,type:"FORMPOSTINPUT"===i?"NUMBER":i})).set({element:e,label:s,type:i})}post(){console.log(10,"Posting values to server: "+this.postUrl);let e=this.getFormPost();e?(this.lock(),$.ajax({url:this.postUrl,type:"POST",data:e,error(e,t,s){console.log(100,"Access Denied: "+t+"("+e.status+")",s)},statusCode:{200(e){console.log("StatusCode: 200",e.message,!0)},201(e){console.log("StatusCode: 201",e)},400(e){console.log("StatusCode: 400",e)},403(e){console.log("StatusCode: 403","Access Denied. Log in to continue",e)},404(e){console.log("StatusCode: 404",e)}},success:e=>{console.log("Posted results to server.",e.message),this.unlock(),this.afterSuccessfulPost(e)}})):(console.log(0,"Post Failed to submit.  Values may be invalid."),this.getMainContainer().loader.showConsole())}}export{ATTRIBUTES,FORMFOOTER,FORMINPUT,FORMPOST,INPUTTYPES,MODEL};
//# sourceMappingURL=FORM.js.map
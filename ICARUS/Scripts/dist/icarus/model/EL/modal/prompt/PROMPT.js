import FORM from"../../form/FORM.js";import FORMINPUT from"../../container/formelement/forminput/FORMINPUT.js";import FORMPOSTINPUT from"../../container/formelement/formpostinput/FORMPOSTINPUT.js";import MODAL from"../MODAL.js";export default class PROMPT extends MODAL{constructor(t,o,r,p,e){super(t,o,e),this.addClass("prompt"),this.form=FORM.createEmptyForm(this.container.body.pane,!1),this.form.prompt=this,this.promptInputs=[],this.addInputs(p),this.addButtons(r)}addInputs(t){if(t)for(let o=0;o<t.length;o++){let r=null;"FORMPOSTINPUT"===t[o].type?this.promptInputs.push(new FORMPOSTINPUT(this.formElementGroup.body.pane,t[o])):this.promptInputs.push(new FORMINPUT(this.formElementGroup.body.pane,t[o])),this.formElementGroup.children.push(r)}}addButtons(t){if(t)for(let o=0;o<t.length;o++)this.form.footer.buttonGroup.addButton(t[o][0],t[o][1],t[o][2])}}export{MODAL};
//# sourceMappingURL=PROMPT.js.map

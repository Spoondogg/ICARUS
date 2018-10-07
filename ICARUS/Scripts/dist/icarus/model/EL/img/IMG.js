import EL from"../EL.js";export default class IMG extends EL{constructor(t,e){super(t,"IMG",e);try{this.getMainContainer().getDev()&&(this.el.ondblclick=this.edit.bind(this))}catch(t){console.warn("IMG does not have a MAIN Container",t)}}}
//# sourceMappingURL=IMG.js.map

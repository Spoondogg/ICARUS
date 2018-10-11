import INPUT,{ATTRIBUTES,EL,MODEL}from"../../../../input/INPUT.js";export default class FORMINPUTTOKEN extends INPUT{constructor(e){super(e,new MODEL(new ATTRIBUTES({type:"HIDDEN",name:"__RequestVerificationToken",value:document.getElementsByTagName("meta").token.content})))}}export{ATTRIBUTES,EL,MODEL};
//# sourceMappingURL=FORMINPUTTOKEN.js.map

import MODEL from"../../../MODEL.js";import NAV from"../NAV.js";import NAVHEADER from"../menu/NAVHEADER.js";export default class NAVBAR extends NAV{constructor(e,a){super(e,a),this.addClass("navbar navbar-nav navbar-inverse collapse"),this.header=new NAVHEADER(this,(new MODEL).set({className:"NAVHEADER",name:"header",label:e.label}))}}
//# sourceMappingURL=NAVBAR.js.map

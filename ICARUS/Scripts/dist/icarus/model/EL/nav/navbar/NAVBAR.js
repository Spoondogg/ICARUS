import MODEL from"../../../MODEL.js";import NAV from"../NAV.js";import NAVHEADER from"../menu/NAVHEADER.js";export default class NAVBAR extends NAV{constructor(s,e){super(s,e),this.addClass("navbar collapse"),this.header=new NAVHEADER(this,(new MODEL).set({label:s.label}))}}
//# sourceMappingURL=NAVBAR.js.map

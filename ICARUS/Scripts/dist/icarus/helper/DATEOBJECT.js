import ATTRIBUTES from"../model/ATTRIBUTES.js";export default class DATE extends ATTRIBUTES{static getDateObject(t){let e=t.toISOString().split("T"),i=e[0].split("-"),l=e[1].split(":"),s=l[2].split(".");return{date:e[0],year:i[0],month:i[1],day:i[2],time:l[0]+":"+l[1]+":"+s[0],hour:l[0],minute:l[1],second:s[0],millisecond:s[1].replace("Z","")}}}
//# sourceMappingURL=DATEOBJECT.js.map

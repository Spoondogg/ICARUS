export default class ExtendableError extends Error{constructor(r){super(r),this.name=this.constructor.name,"function"==typeof Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error(r).stack}}
//# sourceMappingURL=ExtendableError.js.map

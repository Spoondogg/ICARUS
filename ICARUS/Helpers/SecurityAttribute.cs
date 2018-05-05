using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Helpers {
    public class SecurityAttribute : AuthorizeAttribute {

        private string redirectUrl = "";

        /// <summary>
        /// Override Authorize Attribute to return Json payload
        /// </summary>
        public SecurityAttribute() : base() {
        }

        public SecurityAttribute(string redirectUrl) : base() {
            this.redirectUrl = redirectUrl;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext) {
            if (filterContext.HttpContext.Request.IsAjaxRequest()) {
                filterContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                filterContext.Result = new JsonResult {
                    Data = "snoot",
                    ContentEncoding = System.Text.Encoding.UTF8,
                    ContentType = "application/json",
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            } else {
                filterContext.Result = new HttpStatusCodeResult((int)HttpStatusCode.Forbidden);
            }
        }

    }
}
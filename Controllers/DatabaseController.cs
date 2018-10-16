using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Controllers {

    /// <summary>
    /// The Database Controller allows commands to be sent to a database based on the current user's access
    /// </summary>
    public class DatabaseController : Controller {

        /// <summary>
        /// GET: Database
        /// </summary>
        /// <returns></returns>
        public ActionResult Index() {
            return View();
        }

    }
}
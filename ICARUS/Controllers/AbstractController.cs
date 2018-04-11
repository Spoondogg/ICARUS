using ICARUS.Models;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects.DataClasses;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ICARUS.Controllers {

    /// <summary>
    /// An enumerated list of GET Request Result codes
    /// These should really just be web 200, 300 and 400 codes, but start simple
    /// </summary>
    enum GetResults {
        Fail = 0,
        Success = 1
    };

    /// <summary>
    /// An abstract Controller Item that contains abstract async methods required 
    /// for RESTful actions.
    /// 
    /// A RESTful API explicitly takes advantage of HTTP methodologies defined by 
    /// the RFC 2616 protocol. They use GET to retrieve a resource; PUT to change 
    /// the state of or update a resource, which can be an object, file or block; 
    /// POST to create that resource; and DELETE to remove it.
    /// 
    /// </summary>
    /// <see cref="http://searchmicroservices.techtarget.com/definition/RESTful-API"/>
    [Authorize(Roles = "User,Dev,Admin")]
    public abstract class AbstractController : Controller {

        /// <summary>
        /// Key reference for ObjectDbContext.class ie: ObjectDbContext.Articles would use "Article"
        /// </summary>
        public string className;

        public AbstractController(string className) {
            this.className = className;
        }

        /// <summary>
        /// Object Database Context allows querying of the object database
        /// </summary>
        public ObjectDBContext db = new ObjectDBContext();
        
        /// <summary>
        /// Returns the Object DB Context
        /// </summary>
        /// <returns></returns>
        public ObjectDBContext getObjectDbContext() {
            return this.db;
        }

        /// <summary>
        /// Asynchrounously create the object on the database and return an instance of
        /// it to the user as a JSON object model
        /// </summary>
        /// <returns></returns>
        [HttpPost, ValidateAntiForgeryToken, Authorize(Roles = "Dev,Admin")]
        public abstract Task<ActionResult> Create();

        /// <summary>
        /// Asynchrounously create the object on the database and return an instance of
        /// it to the user as a JSON object model
        /// </summary>
        /// <returns></returns>
        [HttpPost, ValidateAntiForgeryToken, Authorize(Roles = "Dev,Admin")]
        public abstract Task<ActionResult> Create(FormPost formPost);

        /// <summary>
        /// Asynchrounously retrieve the object on the database and return an instance of
        /// it to the user as a JSON object model
        /// There is no token to authenticate on a GET request
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet, Authorize(Roles = "Dev,Admin")]
        public virtual async Task<ActionResult> Get(int id = 0) {
            if (id == 0) {
                return await this.Create();
            } else {
                try {
                    return getJson(id);
                } catch (Exception e) {
                    string message = "Failed to GET " + this.className + "("+id+")\n" + e.Message.ToString();
                    return Json(new Payload(
                        0, message, e
                    ), JsonRequestBehavior.AllowGet);
                }
            }
        }

        /// <summary>
        /// Constructs the object and returns as Json
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        private JsonResult getJson(int id) {
            
            EL model = (EL)db.dbSets[this.className].Find(id);
            if (model.authorId == User.Identity.Name) {

                string message = "Successfully retrieved " + this.className + ", subsections (" +
                    model.subsections + ")";

                // Parse subsection Id's and Retrieve any relevant children 
                string[] subsections = model.subsections.Split(',');
                try {
                    // Append all children (that extend from Container)
                    for (int s = 0; s < subsections.Length; s++) {
                        //var child = db.dbSets[this.className].Find(Int32.Parse(subsections[s]));
                        var child = db.dbSets["Container"].Find(Int32.Parse(subsections[s]));
                        EL ch = (EL)child;
                        if (ch.getAuthorId() == User.Identity.Name) {
                            model.addChild(child);
                        }
                    }
                } catch (Exception ex) { /*message += "\n No children exist or " + ex.Message; */ }
                
                // Attach formPost (if exists)


                // Return the fully constructed model
                return Json(new Payload(
                    1, this.className, model,
                    message
                ), JsonRequestBehavior.AllowGet);

            } else {
                string message = User.Identity.Name + ", You do not have permission to access this " + this.className;
                return Json(new Payload(
                    0, message, new Exception(message)
                ), JsonRequestBehavior.AllowGet);
            }

        }

        /// <summary>
        /// Asynchrounously modify the object on the database and return an instance of
        /// it to the user as a JSON object model
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost, ValidateAntiForgeryToken, Authorize(Roles = "Dev,Admin")]
        public abstract Task<ActionResult> Set(FormPost formPost);

        /// <summary>
        /// Asynchrounously set the given object's active state to false if the user is the 
        /// author of this object.
        /// 
        /// Be sure to update any dependant objects as well, or prevent the change
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]  // TODO: Secure as HttpPost 
        [Authorize(Roles = "Dev,Admin")]
        public virtual async Task<ActionResult> Delete(int id) {

            string message = "";
            try {

                // Retrieve the existing object and a temporary object
                var mdl = db.dbSets[this.className].Find(id);
                var model = (EL)mdl;

                // Verify ownership and process deletion
                if (model.getAuthorId() == User.Identity.Name) {

                    db.dbSets[className].Attach(mdl);
                    db.dbSets[className].Remove(mdl);
                    getObjectDbContext().SaveChanges();

                    message = "Successfully deleted " + this.className + "(" + id + ")";

                    return Json(new Payload(
                        Int32.Parse(GetResults.Success.ToString()), 
                        message
                    ), JsonRequestBehavior.AllowGet);

                } else {

                    message = "Failed to delete " + this.className + "(" + id
                    + ")\nYou do not have permissions to modify this " + this.className;

                    return Json(new Payload(
                        Int32.Parse(GetResults.Fail.ToString()),
                        message
                    ), JsonRequestBehavior.AllowGet);

                }

            } catch (Exception e) {

                return Json(new Payload(
                    Int32.Parse(GetResults.Fail.ToString()), e.Message, e), JsonRequestBehavior.AllowGet
                );
            }
        }
    }
}

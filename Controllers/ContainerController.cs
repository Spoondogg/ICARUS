using ICARUS.Models;
using ICARUS.Models.Icarus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Threading;
using System.Text;
using System.Xml;
using ICARUS.Models.Icarus.Elements;
using System.Data.Entity;
using System.Linq.Expressions;
using System.Security.Permissions;

namespace ICARUS.Controllers {

    /// <summary>
    /// Handles loading of web forms.  Requires authorization
    /// </summary>
    public abstract class ContainerController : AbstractController {
        
        /// <summary>
        /// Creates a new instance of this element's class
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public abstract Container make(FormPost formPost = null);

        /// <summary>
        /// Selects a single Container element
        /// </summary>
        /// <returns></returns>
        public abstract Container select(ObjectDBContext ctx, int id);

        /// <summary>
        /// Selects all records that are available to this user
        /// </summary>
        /// <param name="ctx"></param>
        /// <returns></returns>
        public abstract IEnumerable<Container> selectAll(ObjectDBContext ctx);

        /// <summary>
        /// Parameterless Constructor
        /// </summary>
        public ContainerController() : base("DIV") {

        }

        /// <summary>
        /// Generic Constructor
        /// </summary>
        /// <param name="className">Case sensitive label used to call constructor.  See ObjectDBContext</param>
        public ContainerController(string className = "DIV") : base(className) {

        }

        /// <summary>
        /// Generates a Where clause for Entity to filter by Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Expression<Func<Container, bool>> FilterById(int id) {
            return m => (
                m.id == id && m.status != -1
                && (
                    m.authorId == User.Identity.Name
                    || m.isPublic == 1
                )
            );
        }

        /// <summary>
        /// Generates a Where clause for Entity to filter to records that the user is allowed
        /// to access
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Expression<Func<Container, bool>> FilterAllowed() {
            return m => (
                m.status != -1
                && (
                    m.authorId == User.Identity.Name
                    || m.isPublic == 1
                )
            );
        }

        /// <summary>
        /// Get Request Index page for Forms
        /// [Authorize]
        /// </summary>
        /// <returns></returns>
        public virtual async Task<ActionResult> Index() {
            /*
            var containers = from s in getObjectDbContext().Containers
                             where (s.authorId == User.Identity.Name || s.shared == 1)
                             && s.element == className
                             orderby s.label
                             select s;
            */
            var containers = selectAll(getObjectDbContext()).OrderBy(m => m.label);
            return Json(new Payload(
                    1, className, containers.Take(5),
                    "Index"
                ), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a count of all matching containers that belong to this user
        /// [Authorize]
        /// </summary>
        /// <returns></returns>
        public virtual async Task<ActionResult> Count() {
            var count = selectAll(getObjectDbContext()).Count();

            Dictionary<string, object> result = new Dictionary<string, object>();
            result.Add("className", className);
            result.Add("count", count);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a list of Container Ids that belong to this user
        /// [Authorize]
        /// </summary>
        /// <returns></returns>
        public virtual async Task<ActionResult> List() {
            var list = selectAll(getObjectDbContext());
            list = list.OrderByDescending(s => s.id);

            Dictionary<string, object> result = new Dictionary<string, object>();
            result.Add("className", className);

            List<Dictionary<string, object>> listArray = new List<Dictionary<string, object>>();
            foreach (var li in list) {                
                Dictionary<string, object> attribs = new Dictionary<string, object>();
                attribs.Add("id", li.id);
                attribs.Add("label", li.label);
                attribs.Add("metaId", li.metaId);
                listArray.Add(attribs);
            }

            result.Add("list", listArray);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        
        /// <summary>
        /// Returns a list of Container Ids that contain this container
        /// </summary>
        /// <returns>A Page</returns>
        public virtual async Task<ActionResult> Page(
            string page = "0", string pageLength = "10"
        ) {

            int pageLen = Int32.Parse(pageLength);
            pageLen = (pageLen > 50) ? 50 : pageLen;

            List<string> columns = new List<string>();
            columns.Add("index");
            columns.Add("id");
            columns.Add("subsections");
            columns.Add("element");
            columns.Add("className");
            columns.Add("authorId");
            columns.Add("status");
            columns.Add("label");
            columns.Add("tags");
            columns.Add("dateCreated");
            columns.Add("dateLastModified");
            columns.Add("attributesId");
            columns.Add("dataId");
            columns.Add("shared");
            columns.Add("metaId");

            List<Param> parameters = new List<Param>();
            parameters.Add(new Param(1, "discriminator", this.className));
            parameters.Add(new Param(2, "pageLength", pageLen));
            parameters.Add(new Param(3, "page", page));

            Procedure procedure = new Procedure("ICARUS.GetList", columns, parameters);

            return Json(this.Call(procedure), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a list of Container Ids that contain this container
        /// </summary>
        /// <param name="page">Current Page</param>
        /// <param name="pageLength">Number of items per page</param>
        /// <returns>A Json PageIndex</returns>
        public virtual async Task<ActionResult> PageIndex(string page = "0", string pageLength = "10") {

            int pageLen = Int32.Parse(pageLength);
            pageLen = (pageLen > 50) ? 50 : pageLen;

            List<string> columns = new List<string>();
            columns.Add("index");
            columns.Add("id");
            columns.Add("label");
            //columns.Add("metaId");

            List<Param> parameters = new List<Param>();
            parameters.Add(new Param(1, "discriminator", this.className));
            parameters.Add(new Param(2, "pageLength", pageLen));
            parameters.Add(new Param(3, "page", page));

            Procedure procedure = new Procedure("ICARUS.GetList", columns, parameters);

            int total = selectAll(getObjectDbContext()).Where(
                m => m.authorId == User.Identity.Name || m.isPublic == 1
            ).Count();

            Dictionary<string, object> result = new Dictionary<string, object>();
            result.Add("className", className);
            result.Add("total", total);
            result.Add("list", this.Call(procedure));
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a list of Container Ids that contain this container
        /// </summary>
        /// <param name="page">Current Page</param>
        /// <param name="pageLength">Number of items per page</param>
        /// <param name="query">Search string</param>
        /// <returns>A Json PageIndex</returns>
        public virtual async Task<ActionResult> Search(string page = "0", string pageLength = "10", string query = null) {

            int pageLen = Int32.Parse(pageLength);
            pageLen = (pageLen > 50) ? 50 : pageLen;

            List<string> columns = new List<string>();
            columns.Add("index");
            columns.Add("id");
            columns.Add("subsections");
            columns.Add("authorId");
            columns.Add("label");
            columns.Add("description");
            columns.Add("tags");
            //columns.Add("metaId");

            List<Param> parameters = new List<Param>();
            parameters.Add(new Param(1, "discriminator", this.className));
            parameters.Add(new Param(2, "pageLength", pageLen));
            parameters.Add(new Param(3, "page", page));
            parameters.Add(new Param(4, "query", query));

            Procedure procedure = new Procedure("ICARUS.GetSearchList", columns, parameters);

            List<string> searchCountCols = new List<string>();
            searchCountCols.Add("count");

            List<Param> searchCountParams = new List<Param>();
            searchCountParams.Add(new Param(1, "discriminator", this.className));
            searchCountParams.Add(new Param(2, "query", query));

            Procedure searchCount = new Procedure("ICARUS.GetSearchCount", searchCountCols, searchCountParams);
            //int totalNew = this.Call(searchCount);

            /*int total = selectAll(getObjectDbContext()).Where(
                m => m.label.ToLower().Contains(query.ToLower())
            ).Count();*/

            Dictionary<string, object> result = new Dictionary<string, object>();
            result.Add("className", className);
            result.Add("total", this.Call(searchCount)[0]["count"]);
            result.Add("list", this.Call(procedure));

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a list of Container Ids that have this container as one of its children
        /// </summary>
        /// <returns>A Json Object</returns>
        [Authorize]
        public virtual async Task<ActionResult> GetContainerParents(int id = -1) {
            List<string> columns = new List<string>();
            columns.Add("id");
            columns.Add("className");
            columns.Add("label");
            //columns.Add("metaId");

            List<Param> parameters = new List<Param>();
            parameters.Add(new Param(1, "id", id));

            Procedure procedure = new Procedure("ICARUS.GetContainerParents", columns, parameters);
            return Json(this.Call(procedure), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Create an instance of a Container on the database
        /// </summary>
        /// <returns>A Json Object</returns>
        [Authorize]
        public override async Task<ActionResult> Create() {
            try {
                var model = make();
                db.dbSets[this.className].Add(model);
                int result = getObjectDbContext().SaveChanges();
                return Json(new Payload(
                    1, className, model,
                    "Successfully instantiated " + this.className + "(" + model.id + ")"
                ), JsonRequestBehavior.AllowGet);
            } catch (Exception e) {
                return Json(new Payload(0, e,
                    "Container.Create(): Unable to create new instance of " +
                        this.className + "(" + e.GetType() + ")\n" + e.ToString() + "\n\n" +
                        e.Message.ToString()), JsonRequestBehavior.AllowGet
                );
            }
        }
        /// <summary>
        /// Create an instance of a Container on the database
        /// </summary>
        /// <returns>A View</returns>
        [Authorize(Roles = "Dev,Admin")]
        public ActionResult Debug() {
            try {
                Container model = new Container();
                model.setAuthorId(User.Identity.Name);

                // Save the object
                getObjectDbContext().Containers.Add(model);
                int result = getObjectDbContext().SaveChanges();
                
                // Return the Payload
                return Json(new Payload(
                    1, className, model,
                    "Successfully instantiated " + this.className + "(" + model.id + ")"
                ), JsonRequestBehavior.AllowGet);
                return View(model);

            } catch (Exception e) {
                return View();
            }
        }
        /// <summary>
        /// Create an instance of a Container on the database based on the given formPost
        /// </summary>
        /// <param name="formPost">FormPost</param>
        /// <returns>A Json Object</returns>
        public override async Task<ActionResult> Create(FormPost formPost) {
            try {
                var model = make();
                db.dbSets[this.className].Add(model);
                int result = getObjectDbContext().SaveChanges();
                return Json(model);
            } catch (Exception e) {
                return Json(
                    new Payload(0, e,
                        "Container.Create(FormPost): Unable to create new instance of " +
                        this.className + "(" + e.GetType() + ")\n" + e.ToString() + "\n\n" +
                        e.Message.ToString()), JsonRequestBehavior.AllowGet
                );
            }
        }
        /// <summary>
        /// Sets the value of the target object based on the given formPost values
        /// </summary>
        /// <param name="formPost">FormPost</param>
        /// <returns>A Json Object</returns>
        public override async Task<ActionResult> Set(FormPost formPost) {
            try {
                // Extract values from FormPost
                formPost.resultsToXml();
                int id = formPost.parseInt("id", -1);

                // Retrieve the record from the database
                ObjectDBContext ctx = getObjectDbContext();
                var model = select(ctx, id);

                // Set new values
                int result = 0;
                if (model != null) {
                    if(model.authorId == User.Identity.Name || model.shared == 1) {
                        model.status = 1;

                        model.updateContainerModel(formPost);
                        model.dateLastModified = DateTime.UtcNow.ToLocalTime();

                        // Save the object
                        db.dbSets[this.className].Add(model); // ctx.Containers.Add(model);
                        ctx.Entry(model).State = System.Data.Entity.EntityState.Modified; // Critical
                        result = ctx.SaveChanges();

                        // Return the success response along with the message body
                        return Json(new Payload(
                            1, this.className, model
                            //"Successfully set " + this.className + " (" + model.id + "," + id + ")"
                        ), JsonRequestBehavior.AllowGet);
                    } else {
                        return Json(new Payload(
                            0, "You are not authorized to modify this " + this.className + "(" + id + ")"
                        ), JsonRequestBehavior.AllowGet);
                    }
                } else {
                    return Json(new Payload(
                        0, "Failed to retrieve " + this.className + "(" + id + ").  The request returned null."
                    ), JsonRequestBehavior.AllowGet);
                }
            } catch (Exception e) {
                return Json(new Payload(
                    0, e, 
                    "Unknown exception for " + this.className + "<br><br>" 
                    + e.Message.ToString()), JsonRequestBehavior.AllowGet
                );
            }
        }
        /// <summary>
        /// Asynchrounously set the given object's active state to false if the user is the 
        /// author of this object.
        /// @TODO Update any dependant objects as well, or prevent the change
        /// </summary>
        /// <param name="id">id</param>
        /// <returns>A Json Object</returns>
        [HttpPost, ValidateAntiForgeryToken, Authorize(Roles = "Dev,Admin")] //Authorize
        public virtual async Task<ActionResult> Disable(int id) {
            string message = "";
            try {
                // Retrieve the record from the database
                ObjectDBContext ctx = getObjectDbContext();
                var model = select(ctx, id);

                // Verify ownership and process deletion
                if (model.getAuthorId() == User.Identity.Name) {

                    List<string> columns = new List<string>();
                    columns.Add("id");
                    columns.Add("className");
                    columns.Add("label");

                    List<Param> parameters = new List<Param>();
                    parameters.Add(new Param(1, "id", id));

                    // Only delete if this Container does not have parents
                    Procedure procedure = new Procedure("ICARUS.GetContainerParents", columns, parameters);

                    List<Dictionary<string, object>> records = this.Call(procedure);
                    if(records.Count <= 1) { // Should only exist in MAIN or nowhere
                        // Set new values
                        int result = 0;
                        if (model != null) {
                            model.status = -1;
                            model.dateLastModified = DateTime.UtcNow.ToLocalTime();
                            //model.updateContainerModel(formPost);

                            // Save the object
                            db.dbSets[this.className].Add(model); // ctx.Containers.Add(model);
                            ctx.Entry(model).State = System.Data.Entity.EntityState.Modified; // Critical
                            result = ctx.SaveChanges();

                            // Return the success response along with the message body
                            return Json(new Payload(
                                1, this.className, model,
                                "Successfully disabled " + this.className + " (" + model.id + "," + id + ")"
                            ), JsonRequestBehavior.AllowGet);

                        } else {
                            return Json(new Payload(
                                0, "Failed to disable " + this.className + "(" + id + ").  The request returned null."
                            ), JsonRequestBehavior.AllowGet);
                        }
                    } else {
                        return Json(new Payload(
                            0, "Failed to disable " + this.className + "(" + id + ").  This Container is still in use."
                        ), JsonRequestBehavior.AllowGet);
                    }
                } else {
                    message = "Failed to disable " + this.className + "(" + id
                    + ")\nYou do not have permissions to modify this " + this.className;

                    return Json(new Payload(0, message), JsonRequestBehavior.AllowGet);
                }
            } catch (Exception e) {
                return Json(new Payload(0, e, e.Message), JsonRequestBehavior.AllowGet);
            }
        }
    }
}
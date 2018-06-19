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
        /// Get Request Index page for Forms
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public virtual async Task<ActionResult> Index() {
            var containers = from s in getObjectDbContext().Containers
                             where (s.authorId == User.Identity.Name) && (s.element == className)
                             orderby s.label
                             select s;

            return Json(new Payload(
                    1, className, containers.Take(5),
                    "Index"
                ), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a count of all matching containers that belong to this user
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public virtual async Task<ActionResult> Count() {
            IQueryable<Container> records = getObjectDbContext().Containers.Where(
                r => (r.authorId == User.Identity.Name) && (r.element == className)
            );
            var count = records.Count();

            Dictionary<string, object> result = new Dictionary<string, object>();
            result.Add("className", className);
            result.Add("count", count);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a list of Container Ids that belong to this user
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public virtual async Task<ActionResult> List() {
            var list = from s in getObjectDbContext().Containers
                        where (s.authorId == User.Identity.Name) && (s.element == className)
                        select s;
            list = list.OrderByDescending(s => s.id);

            Dictionary<string, object> result = new Dictionary<string, object>();
            result.Add("className", className);

            List<int> listArray = new List<int>();
            foreach(var li in list) {
                listArray.Add(li.id);
            }

            result.Add("list", listArray);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Create an instance of a Container on the database
        /// </summary>
        /// <returns></returns>
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
                return Json(new Payload(
                        0,
                        "Unable to create new instance of " +
                        this.className + "()\n" + e.ToString() + "\n\n" +
                        e.Message.ToString(),
                        e
                    ), JsonRequestBehavior.AllowGet
                );
            }
        }

        /// <summary>
        /// Create an instance of a Container on the database
        /// </summary>
        /// <returns></returns>
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
        /// <param name="formPost"></param>
        /// <returns></returns>
        public override async Task<ActionResult> Create(FormPost formPost) {
            try {
                var model = make();
                db.dbSets[this.className].Add(model);
                int result = getObjectDbContext().SaveChanges();
                return Json(model);
            } catch (Exception e) {
                return Json(
                    new Payload(
                        0,
                        "Unable to create new instance of " +
                        this.className + "()\n" + e.ToString() + "\n\n" +
                        e.Message.ToString(),
                        e
                    ), JsonRequestBehavior.AllowGet
                );
            }
        }

        /// <summary>
        /// Sets the value of the target object based on the given formPost values
        /// </summary>
        /// <param name="formPost"></param>
        /// <returns></returns>
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
                    model.status = 1;
                    model.updateContainerModel(formPost);

                    // Save the object
                    db.dbSets[this.className].Add(model); // ctx.Containers.Add(model);
                    ctx.Entry(model).State = System.Data.Entity.EntityState.Modified; // Critical
                    result = ctx.SaveChanges();

                    // Return the success response along with the message body
                    return Json(new Payload(
                        1, this.className, model,
                        "Successfully set " + this.className + " (" + model.id + "," + id + ")"
                    ), JsonRequestBehavior.AllowGet);

                } else {
                    return Json(new Payload(
                        0, "Failed to retrieve " + this.className + "(" + id + ").  The request returned null."
                    ), JsonRequestBehavior.AllowGet);
                }
            } catch (Exception e) {
                return Json(new Payload(
                    0, "Unknown exception for " + this.className + "<br><br>" + e.Message.ToString(), e
                ), JsonRequestBehavior.AllowGet);
            }
        }
    }
}
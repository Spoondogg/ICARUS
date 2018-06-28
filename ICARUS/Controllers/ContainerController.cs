﻿using ICARUS.Models;
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
        //public abstract Container select(ObjectDBContext ctx, int id);
        public virtual Container select(ObjectDBContext ctx, int id) {
            var model = ctx.Containers.Single(m =>
                   m.id == id && (m.authorId == User.Identity.Name || m.shared == 1)
                );
            return model;
        }

        /// <summary>
        /// Select A
        /// </summary>
        /// <param name="ctx"></param>
        /// <returns></returns>
        //public abstract IEnumerable<Container> selectAll(ObjectDBContext ctx);
        public virtual IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.Containers.Where(m =>
                (m.authorId == User.Identity.Name || m.shared == 1)
            );
        }

        /// <summary>
        /// Returns the DbSet for THIS class (Must be manually specified)
        /// ie: return ctx.Jumbotrons;
        /// </summary>
        /// <param name="ctx"></param>
        /// <returns></returns>
        public virtual DbSet getDbSet(ObjectDBContext ctx) {
            return ctx.Containers;
        }

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
        //[Authorize]
        public virtual async Task<ActionResult> Index() {
            var containers = from s in getObjectDbContext().Containers
                             where (s.authorId == User.Identity.Name || s.shared == 1)
                             && s.element == className
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
        //[Authorize]
        public virtual async Task<ActionResult> Count() {
            var count = selectAll(getObjectDbContext()).Where(
                m => m.authorId == User.Identity.Name || m.shared == 1
            ).Count();

            Dictionary<string, object> result = new Dictionary<string, object>();
            result.Add("className", className);
            result.Add("count", count);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a list of Container Ids that belong to this user
        /// </summary>
        /// <returns></returns>
        //[Authorize]
        public virtual async Task<ActionResult> List() {
            var list = from s in selectAll(getObjectDbContext())
                       where s.authorId == User.Identity.Name || s.shared == 1
                       select s;

            list = list.OrderByDescending(s => s.id);

            Dictionary<string, object> result = new Dictionary<string, object>();
            result.Add("className", className);

            List<Dictionary<string, object>> listArray = new List<Dictionary<string, object>>();
            foreach (var li in list) {
                
                Dictionary<string, object> attribs = new Dictionary<string, object>();
                attribs.Add("id", li.id);
                attribs.Add("label", li.label);
                listArray.Add(attribs);
            }

            result.Add("list", listArray);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a list of Container Ids that contain this container
        /// ie http://localhost:8052/JUMBOTRON/Page?page=0&pageLength=2
        /// </summary>
        /// <returns></returns>
        //[Authorize]
        public virtual async Task<ActionResult> Page(string page = "0", string pageLength = "10") {

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
            columns.Add("showHeader");
            columns.Add("label");
            columns.Add("collapsed");
            columns.Add("hasTab");
            columns.Add("dateCreated");
            columns.Add("dateLastModified");
            columns.Add("hasSidebar");
            columns.Add("attributesId");
            columns.Add("dataId");
            columns.Add("shared");
            columns.Add("descriptionId");

            List<Param> parameters = new List<Param>();
            parameters.Add(new Param(1, "discriminator", this.className));
            parameters.Add(new Param(2, "pageLength", pageLen));
            parameters.Add(new Param(3, "page", page));

            Procedure procedure = new Procedure("ICARUS.GetPaginatedList", columns, parameters);

            return Json(this.Call(procedure), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a list of Container Ids that contain this container
        /// ie http://localhost:8052/JUMBOTRON/Page?page=0&pageLength=2
        /// </summary>
        /// <returns></returns>
        //[Authorize]
        public virtual async Task<ActionResult> PageList(string page = "0", string pageLength = "10") {

            int pageLen = Int32.Parse(pageLength);
            pageLen = (pageLen > 50) ? 50 : pageLen;

            List<string> columns = new List<string>();
            columns.Add("index");
            columns.Add("id");
            columns.Add("label");

            List<Param> parameters = new List<Param>();
            parameters.Add(new Param(1, "discriminator", this.className));
            parameters.Add(new Param(2, "pageLength", pageLen));
            parameters.Add(new Param(3, "page", page));

            Procedure procedure = new Procedure("ICARUS.GetPaginatedList", columns, parameters);

            int total = selectAll(getObjectDbContext()).Where(
                m => m.authorId == User.Identity.Name || m.shared == 1
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
        /// <returns></returns>
        [Authorize]
        public virtual async Task<ActionResult> GetContainerParents(int id = -1) {
            List<string> columns = new List<string>();
            columns.Add("id");
            columns.Add("className");
            columns.Add("label");

            List<Param> parameters = new List<Param>();
            parameters.Add(new Param(1, "id", id));

            Procedure procedure = new Procedure("ICARUS.GetContainerParents", columns, parameters);

            //List<Dictionary<string, string>> records = this.Call(procedure);

            return Json(this.Call(procedure), JsonRequestBehavior.AllowGet);
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
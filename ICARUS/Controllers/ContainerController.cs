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
    [Authorize]
    public class ContainerController : AbstractController {

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
        /// Create an instance of a Container on the database
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public override async Task<ActionResult> Create() {
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


            } catch (Exception e) {

                // Return the formPost for debugging
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
        [Authorize]
        public ActionResult Debug() {

            try {

                Container model = new Container();
                model.setAuthorId(User.Identity.Name);

                // Save the object
                getObjectDbContext().Containers.Add(model);
                int result = getObjectDbContext().SaveChanges();

                /*
                // Return the Payload
                return Json(new Payload(
                    1, className, model,
                    "Successfully instantiated " + this.className + "(" + model.id + ")"
                ), JsonRequestBehavior.AllowGet);
                */
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
            Container model = null;
            try {
                model = new Container(this.className, formPost);
                model.setAuthorId(User.Identity.Name);

                getObjectDbContext().Containers.Add(model);
                getObjectDbContext().SaveChanges();

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

            // Parse formPost results
            formPost.resultsToXml();
            int id = Int32.Parse(formPost.getXml().GetElementsByTagName("id")[0].InnerText);
            string label = formPost.getXml().GetElementsByTagName("label")[0].InnerText;

            string subsections = formPost.getXml().GetElementsByTagName("subsections")[0].InnerText;
            if (subsections.Length == 0) {
                subsections = "0";
            }

            int hasTab = Int32.Parse(formPost.getXml().GetElementsByTagName("hasTab")[0].InnerText);
            int showHeader = Int32.Parse(formPost.getXml().GetElementsByTagName("showHeader")[0].InnerText);
            int collapsed = Int32.Parse(formPost.getXml().GetElementsByTagName("collapsed")[0].InnerText);
            int hasSidebar = Int32.Parse(formPost.getXml().GetElementsByTagName("hasSidebar")[0].InnerText);
            int formPostId = Int32.Parse(formPost.getXml().GetElementsByTagName("formPostId")[0].InnerText);

            try {
                ObjectDBContext ctx = getObjectDbContext();

                /*
                Container model = (Container)ctx.Containers.Single(m =>
                   m.id == id && m.authorId == User.Identity.Name
                );
                */
                var model = (Container) ctx.dbSets[this.className].Find(id);
                if(model.authorId == User.Identity.Name) {
                    int result = 0;
                    if (model != null) {
                        model.subsections = subsections;
                        model.label = label;
                        model.hasTab = hasTab;
                        model.showHeader = showHeader;
                        model.hasSidebar = hasSidebar;
                        model.collapsed = collapsed;
                        model.formPostId = formPostId;
                        model.status = 1;

                        // Save the object
                        ctx.dbSets[this.className].Add(model);
                        ctx.Entry(model).State = System.Data.Entity.EntityState.Modified;
                        result = ctx.SaveChanges();

                        // Return the success response along with the message body
                        return Json(new Payload(
                            1, className, model,
                            "Successfully set " + this.className + "(" + model.id + " ==> " + id + ")"
                        ), JsonRequestBehavior.AllowGet);

                    } else {
                        return Json(new Payload(
                            0, "Failed to retrieve " + this.className + "(" + model.id + " ==> " + id + ")"
                        ), JsonRequestBehavior.AllowGet);
                    }
                } else {
                    return Json(new Payload(
                        0, "You do not have permission to retrieve " + this.className + "(" + model.id + " ==> " + id + ")"
                    ), JsonRequestBehavior.AllowGet);
                }
            } catch (Exception e) {
                return Json(new Payload(
                    0, e.Message.ToString(), e
                ), JsonRequestBehavior.AllowGet);
            }
        }
    }
}
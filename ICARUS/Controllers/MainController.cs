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
using System.Data.Entity.Infrastructure;

namespace ICARUS.Controllers {

    /// <summary>
    /// Handles loading of web forms.  Requires authorization
    /// </summary>
    [Authorize]
    public class MainController : AbstractController {
        
        public MainController() : base("Main") {

        }

        public override async Task<ActionResult> Create() {
            // Attempt to create and save to the database
            try {

                Main model = new Main();
                model.setAuthorId(User.Identity.Name);

                // Save the object
                getObjectDbContext().Mains.Add(model);
                int result = getObjectDbContext().SaveChanges();

                // Return the payload
                return Json(new Payload(
                    1, className, model,
                    "Successfully instantiated " + this.className + "(" + model.id + ")"
                ), JsonRequestBehavior.AllowGet);

            } catch (Exception e) {

                // Return the formPost for debugging
                return Json(new Payload(0, "Failed to create " + className + "\n" + e.Message, e), JsonRequestBehavior.AllowGet);
            }
        }

        public override async Task<ActionResult> Create(FormPost formPost) {
            Main model = null;
            try {
                model = new Main(formPost);
                getObjectDbContext().Mains.Add(model);
                getObjectDbContext().SaveChanges();
                return Json(model);
            } catch (Exception e) {
                return Json(new Payload(
                    0,
                    "Unable to create new instance of " + this.className + "()\n" + e.ToString() + "\n\n" + e.Message.ToString(),
                    e
                ), JsonRequestBehavior.AllowGet);
            }
        }


        /// <summary>
        /// Sets the value of the target object based on the given formPost values
        /// </summary>
        /// <param name="formPost"></param>
        /// <returns></returns>
        public override async Task<ActionResult> Set(FormPost formPost) {

            formPost.resultsToXml();
            int id = Int32.Parse(formPost.getXml().GetElementsByTagName("id")[0].InnerText);
            string label = formPost.getXml().GetElementsByTagName("label")[0].InnerText;

            string subsections = formPost.getXml().GetElementsByTagName("subsections")[0].InnerText;
            if (subsections.Length == 0) {
                subsections = "0";
            }

            try { //db.dbSets[this.className]
                ObjectDBContext ctx = getObjectDbContext();                
                Main model = (Main)ctx.Mains.Single(m =>
                   m.id == id && m.authorId == User.Identity.Name
                );

                int result = 0;
                if (model != null) {
                    model.subsections = subsections;
                    model.label = label;
                    model.hasTab = 0;
                    model.showHeader = 0;
                    model.collapsed = 0;
                    model.status = 1;

                    // Save the object                
                    ctx.Mains.Add(model);
                    ctx.Entry(model).State = System.Data.Entity.EntityState.Modified; // CRITICAL!!!!!!!!
                    result = ctx.SaveChanges();

                    // Return the success response along with the message body
                    return Json(new Payload(
                        1, className, model,
                        "Successfully set " + this.className + "(" + model.id + " ==> " + id + ")"
                    ), JsonRequestBehavior.AllowGet);

                } else {
                    return Json(new Payload(
                        0, "Failed to retrieve " + this.className + "(" + id + ")"
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
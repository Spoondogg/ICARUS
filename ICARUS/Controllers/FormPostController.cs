using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ICARUS.Models.Icarus;
using System.Threading.Tasks;
using ICARUS.Models.Icarus.Elements;
using System.Threading;
using System.Xml;

namespace ICARUS.Controllers {
    public class FormPostController : AbstractController {

        public FormPostController() : base("FormPost") {

        }

        /// <summary>
        /// GET: FormPosts sorted descending by timestamp
        /// </summary>
        /// <returns></returns>
        public ActionResult Index() {
            var posts = from p in getObjectDbContext().FormPosts
                        where p.authorId == User.Identity.Name
                        select p;
            posts = posts.OrderBy(p => p.formId).ThenByDescending(p => p.dateCreated);
            return Json(posts.ToList());
        }

        /// <summary>
        /// Creates an Empty Formpost and returns the model
        /// </summary>
        /// <returns></returns>
        public FormPost createEmptyFormPost() {
            FormPost formPost = new FormPost();
            formPost.id = 0;
            formPost.formId = 0;
            formPost.authorId = User.Identity.Name;
            formPost.version = 20180104.001;
            formPost.status = 1;
            formPost.dateCreated = DateTime.UtcNow;
            formPost.results = new List<FormValue>();
            formPost.xmlResults = "<root></root>";
            formPost.resultsToXml();
            formPost.jsonResults = "";

            return formPost;
        }
        
        public override async Task<ActionResult> Create() {
            try {

                var model = createEmptyFormPost();

                // Save the object
                db.dbSets[this.className].Add(model);
                int result = getObjectDbContext().SaveChanges();

                // Return the Payload
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


        public override async Task<ActionResult> Create(FormPost formPost) {
            // TODO: Determine if form is new or update 
            // (Are we editing an existing post or creating a new one?)

            // Set formPost attributes where applicable
            formPost.formId = formPost.id;
            formPost.authorId = User.Identity.Name;
            formPost.version = 20180104.001;
            // https://stackoverflow.com/questions/114983/given-a-datetime-object-how-do-i-get-an-iso-8601-date-in-string-format
            formPost.dateCreated = DateTime.UtcNow;
            formPost.resultsToXml();
            formPost.jsonResults = "";

            // Attempt to save the form to the database
            try {

                // Save the object
                getObjectDbContext().FormPosts.Add(formPost);
                int success = getObjectDbContext().SaveChanges();
                
                // Return the success response along with the email message body
                return Json(new {
                    text = "success: " + success,
                    message = formPost.getMessage(),
                    formPost = formPost
                });

            } catch (Exception e) {
                // Return the form for debugging
                return Json(new { text = "fail", message = e.Message, form = formPost, exception = e.ToString() });
            }
        }

        /// <summary>
        /// Constructs the object and returns as Json
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public override JsonResult getJson(int id) {
            FormPost model = (FormPost) db.dbSets[this.className].Find(id);
            if (model.authorId == User.Identity.Name || model.shared == 1) {

                string message = "Successfully retrieved " + this.className;
                return Json(new Payload(
                    1, this.className, model,
                    message
                ), JsonRequestBehavior.AllowGet);

            } else {
                string message = "You do not have permission to access this " + this.className;
                return Json(new Payload(
                    0, message, new Exception(message)
                ), JsonRequestBehavior.AllowGet);
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
                int shared = formPost.parseInt("shared", 0);

                // Retrieve the record from the database
                ObjectDBContext ctx = getObjectDbContext();
                FormPost model = ctx.FormPosts.Single(m =>
                   m.id == id && (m.authorId == User.Identity.Name || m.shared == 1)
                );

                formPost.setXml();
                formPost.resultsToXml();

                // Set new values
                int result = 0;
                model.xmlResults = formPost.xmlResults;
                model.jsonResults = formPost.jsonResults;
                model.formId = id;
                model.shared = shared;

                // Save the object
                ctx.FormPosts.Add(model);
                ctx.Entry(model).State = System.Data.Entity.EntityState.Modified; // Critical
                result = ctx.SaveChanges();

                // Return the success response along with the message body
                return Json(new Payload(
                    1, "FORMPOST", model,
                    "Successfully set FORMPOST (" + model.id + "," + id + ")"
                ), JsonRequestBehavior.AllowGet);

            } catch (Exception e) {
                return Json(new Payload(
                    0, "Unknown exception for FORMPOST<br><br>" + e.Message.ToString(), e
                ), JsonRequestBehavior.AllowGet);
            }
        }
    }
}
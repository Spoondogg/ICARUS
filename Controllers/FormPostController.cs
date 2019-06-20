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
using System.Data.Entity.Validation;
using System.Data.Entity.Infrastructure;
using System.Net.Mail;

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
            formPost.status = 1;
            formPost.dateCreated = DateTime.UtcNow.ToLocalTime();
            formPost.dateLastModified = DateTime.UtcNow.ToLocalTime();
            formPost.results = new List<FormValue>();
            formPost.xmlResults = "<root></root>";
            formPost.resultsToXml();
            return formPost;
        }        
        /// <summary>
        /// Create an empty FormPost representing this
        /// </summary>
        /// <returns></returns>
        public override async Task<ActionResult> Create() {
            try {
                var model = createEmptyFormPost();
                db.dbSets[this.className].Add(model);
                int result = getObjectDbContext().SaveChanges();

                // Return the Payload
                return Json(new Payload(
                    1, className, model,
                    "Successfully instantiated " + this.className + "(" + model.id + ")"
                ), JsonRequestBehavior.AllowGet);

            } catch (Exception e) {
                return Json(new Payload(0, e,
                    "FormPostController.Create(): Unable to create new instance of " +
                        this.className + "(" + e.GetType() + ")\n" + e.ToString() + "\n\n" +
                        e.Message.ToString()), JsonRequestBehavior.AllowGet
                );
            }
        }
        /// <summary>
        /// Create a FORMPOST using the given posted values
        /// https://stackoverflow.com/questions/114983/given-a-datetime-object-how-do-i-get-an-iso-8601-date-in-string-format
        /// </summary>
        /// <param name="formPost"></param>
        /// <returns></returns>
        public override async Task<ActionResult> Create(FormPost formPost) {
            // Set formPost attributes where applicable
            formPost.formId = formPost.id;
            formPost.id = 0; // Id will be appended
            formPost.authorId = User.Identity.Name;
            formPost.dateCreated = DateTime.UtcNow.ToLocalTime();
            formPost.dateLastModified = DateTime.UtcNow.ToLocalTime();
            formPost.resultsToXml();

            // Attempt to save the form to the database
            try {
                // Save the object
                getObjectDbContext().FormPosts.Add(formPost);
                int success = getObjectDbContext().SaveChanges();
                // Return the success response
                return Json(new Payload(
                    1, "FORMPOST", formPost,
                    formPost.getMessage()
                ));
            } catch (Exception e) {
                var message = e.Message;
                return Json(new Payload(0, e, "FormPostController.submit(" + e.GetType() + ")" + formPost.getMessage() + "\n\n" + e.Message));
            }
        }
        /// <summary>
        /// Sends the FormPost as an email
        /// See http://www.mikesdotnetting.com/article/268/how-to-send-email-in-asp-net-mvc
        /// </summary>
        /// <param name="success"></param>
        /// <param name="formPost"></param>
        private async Task<Boolean> sendEmailAsync(int success, FormPost formPost) {
            if (success == 1) {
                var body = "<p>Email From: {0} ({1})</p><p>Message:</p><p>{2}</p>";
                var message = new MailMessage();
                message.To.Add(new MailAddress(User.Identity.Name));
                message.From = new MailAddress(User.Identity.Name);
                message.Subject = "Form ID: " + formPost.id;
                message.Body = string.Format(
                    body, User.Identity.Name, User.Identity.Name,
                    "Success: " + success + "\n\n" + formPost.getMessage()
                );
                message.IsBodyHtml = true;

                // Send the email asynchronously
                using (var smtp = new SmtpClient()) {
                    await smtp.SendMailAsync(message);
                }
            }
            return true;
        }
        /// <summary>
        /// Constructs the object and returns as Json
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public override JsonResult getJson(int id) {
            FormPost model = (FormPost) db.dbSets[this.className].Find(id);
            if (model.authorId == User.Identity.Name || model.isPublic == 1) {

                string message = "Successfully retrieved " + this.className;
                return Json(new Payload(
                    1, this.className, model,
                    message
                ), JsonRequestBehavior.AllowGet);

            } else {
                string message = "You do not have permission to access this " + this.className;
                return Json(new Payload(0, new Exception(message), message), JsonRequestBehavior.AllowGet);
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
                int isPublic = formPost.parseInt("isPublic", 0);

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
                model.formId = formPost.formId;
                model.shared = shared;
                model.isPublic = isPublic;

                // Save the object
                ctx.FormPosts.Add(model);
                ctx.Entry(model).State = System.Data.Entity.EntityState.Modified; // Critical
                result = ctx.SaveChanges();

                // Return the success response along with the message body
                return Json(new Payload(1, "FORMPOST", model)); //, JsonRequestBehavior.AllowGet // "Successfully set FORMPOST (" + model.id + "," + id + ")"

            } catch (Exception e) {
                return Json(new Payload(0, e, "Unknown exception for FORMPOST<br><br>" + e.Message.ToString())); // JsonRequestBehavior.AllowGet
            }
        }
    }
}
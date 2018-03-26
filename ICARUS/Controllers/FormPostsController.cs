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

namespace ICARUS.Controllers {
    public class FormPostsController : AbstractController {

        public FormPostsController() : base("FormPost") {

        }

        /// <summary>
        /// GET: FormPosts sorted descending by timestamp
        /// </summary>
        /// <returns></returns>
        public ActionResult Index() {
            var posts = from p in getObjectDbContext().FormPosts
                        where p.authorId == User.Identity.Name
                        select p;
            posts = posts.OrderBy(p => p.formId).ThenByDescending(p => p.timestamp);
            return Json(posts.ToList());
        }
        
        /*
        protected override void Dispose(bool disposing) {
            if (disposing) {
                getObjectDbContext().Dispose();
            }
            base.Dispose(disposing);
        }
        */

        public override async Task<ActionResult> Create() {
            throw new NotImplementedException();
        }

        public override async Task<ActionResult> Create(FormPost formPost) {
            // TODO: Determine if form is new or update 
            // (Are we editing an existing post or creating a new one?)

            // Set formPost attributes where applicable
            formPost.formId = formPost.id;
            formPost.authorId = User.Identity.Name;
            formPost.version = 20180104.001;
            // https://stackoverflow.com/questions/114983/given-a-datetime-object-how-do-i-get-an-iso-8601-date-in-string-format
            formPost.timestamp = DateTime.UtcNow.ToString("s", System.Globalization.CultureInfo.InvariantCulture);
            formPost.resultsToXml();

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

        public override async Task<ActionResult> Set(FormPost model) {
            throw new NotImplementedException();
        }
        
    }
}
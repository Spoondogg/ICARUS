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

namespace ICARUS.Controllers {

    /// <summary>
    /// Handles loading of web forms.  Requires authorization
    /// </summary>
    [Authorize]
    public class FormController : ContainerController {

        public FormController() : base("Form") {

        }

        /// <summary>
        /// Get Request Index page for Forms
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public ActionResult Index() {
            var forms = from s in getObjectDbContext().Forms
                        where s.authorId == User.Identity.Name
                        orderby s.label
                        select s;
            return View(forms);
        }
        
        public override async Task<ActionResult> Create(FormPost formPost) {
            try {
                Form model = new Form(formPost);
                model.setAuthorId(User.Identity.Name);

                getObjectDbContext().Forms.Add(model);
                int results = getObjectDbContext().SaveChanges();

                return Json(new Payload(results, "FORM", model, "Successfully created " +className));

            } catch (Exception e) {
                return Json(
                    new Payload(
                        0, 
                        "Unable to create new instance of "+this.className+"\n" 
                        + e.ToString() + "\n\n" + e.Message.ToString(),
                        e
                    ), 
                JsonRequestBehavior.AllowGet);
            }
        }

        public override async Task<ActionResult> Create() {
            try {
                // Save the object
                Form model = new Form();
                model.setAuthorId(User.Identity.Name);

                getObjectDbContext().Forms.Add(model);
                int result = getObjectDbContext().SaveChanges();
                return Json(
                    new Payload(
                        result, className, model, "Successfully created "+className+"(" + model.id + ")"
                    ), 
                JsonRequestBehavior.AllowGet);

            } catch (Exception e) {
                return Json(new Payload(0, "Failed to create "+className+"\n" + e.Message, e), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// POST's the IcarusForm FORMPOST results to the server
        /// POST: FormElement/Submit
        /// </summary>
        /// <param name="collection">POSTed values</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Submit(FormPost formPost) {

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

                // Send an email in a seperate thread so as not to hold up the form
                // https://stackoverflow.com/questions/363377/how-do-i-run-a-simple-bit-of-code-in-a-new-thread
                if (success == 1) {
                    new Thread( async() => {

                        // http://www.mikesdotnetting.com/article/268/how-to-send-email-in-asp-net-mvc

                        // Construct the message
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

                    }).Start();
                }

                // Return the success response along with the email message body
                return Json(new Payload(1, "FORMPOST", formPost, formPost.getMessage()));

            } catch (Exception e)  {
                return Json(new Payload(0, e.Message, e));
            }
        }        
    }
}
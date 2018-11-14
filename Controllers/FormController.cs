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
using System.Data.Entity.Validation;

namespace ICARUS.Controllers {

    /// <summary>
    /// Handles loading of web forms.  Requires authorization
    /// </summary>
    public class FormController : ContainerController {

        public FormController() : base("Form") {

        }

        /// <summary>
        /// Instantiate a Container using Main defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            var obj = (formPost == null)
                ? new FORM()
                : new FORM(formPost);

            obj.setAuthorId(User.Identity.Name);
            return obj;
        }
        
        /// <summary>
        /// Select a single element
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public override Container select(ObjectDBContext ctx, int id) {
            return ctx.Forms.AsQueryable().Single(FilterById(id));
        }

        /// <summary>
        /// Select a single element
        /// </summary>
        /// <param name="ctx"></param>
        /// <returns></returns>
        public override IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.Forms.Where(FilterAllowed());
        }

        /// <summary>
        /// POST's the IcarusForm FORMPOST results to the server
        /// POST: FormElement/Submit
        /// </summary>
        /// <param name="collection">POSTed values</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Submit(FormPost formPost) {
            
            // Set formPost attributes where applicable
            formPost.formId = formPost.id;
            formPost.authorId = User.Identity.Name;
            // https://stackoverflow.com/questions/114983/given-a-datetime-object-how-do-i-get-an-iso-8601-date-in-string-format
            formPost.dateCreated = DateTime.UtcNow;

            formPost.setXml();
            formPost.resultsToXml();

            // Attempt to save the form to the database
            try {

                // Save the object
                getObjectDbContext().FormPosts.Add(formPost);
                int success = getObjectDbContext().SaveChanges();

                /*
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
                */

                // Return the success response along with the email message body
                return Json(new Payload(1, "FORMPOST", formPost, formPost.getMessage()));

            } catch (DbEntityValidationException e)  {
                var message = e.Message;
                return Json(new Payload(0, e, "FormController.submit(DbEntityValidationException)" + formPost.getMessage() + "\n\n" + e.Message));
            } catch (Exception ee) {
                var message = ee.Message;
                return Json(new Payload(0, ee, "FormController.submit(" + ee.GetType() + ") FAIL" + formPost.getMessage() + "\n\n" + ee.Message));
            }
        }

    }
}
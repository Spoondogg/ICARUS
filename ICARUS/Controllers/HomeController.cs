using System.Web.Mvc;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using ICARUS.Models;
using ICARUS.Models.Icarus.Elements;
using System.Collections.Generic;
using System;
using System.Web.Helpers;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements.Attributes;
using System.Linq;

namespace ICARUS.Controllers {

    /// <summary>
    /// Controller for HOME pages, services etc
    /// </summary>
    [Authorize]
    public class HomeController : AbstractController {

        public HomeController() : base("Home") {

        }

        /// <summary>
        /// The default page
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public ActionResult Index(int id = 1) { // 0 creates a new APP instance, 1 should be the initial page
            ViewBag.id = id;
            ViewBag.Title = "Icarus";
            return View();
        }

        /// <summary>
        /// A contact form for emailing specific users
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = "User,Dev,Admin,Guest")]
        public ActionResult Contact() {
            return View();
        }

        /// <summary>
        /// The Contact Task that processes email details
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, ValidateAntiForgeryToken]
        public async Task<ActionResult> Contact(Email model) {
            if (ModelState.IsValid) {

                // http://www.mikesdotnetting.com/article/268/how-to-send-email-in-asp-net-mvc
                var body = "<p>Email From: {0} ({1})</p><p>Message:</p><p>{2}</p>";
                var message = new MailMessage();
                message.To.Add(new MailAddress("ryan@spoonmedia.ca"));  // replace with valid value 
                message.From = new MailAddress("ryan@spoonmedia.ca");  // replace with valid value
                if (model.toEmail != null){
                    message.To.Add(new MailAddress(model.toEmail));  // replace with valid value 
                }

                message.Subject = model.subject;
                message.Body = string.Format(body, model.fromName, model.fromEmail, model.message);
                message.IsBodyHtml = true;

                using (var smtp = new SmtpClient()) {
                    await smtp.SendMailAsync(message);
                    return RedirectToAction("Sent");
                }
            }
            return View(model);
        }
        
        public override Task<ActionResult> Create() {
            throw new NotImplementedException();
        }

        public override Task<ActionResult> Create(FormPost formPost) {
            throw new NotImplementedException();
        }

        public override Task<ActionResult> Set(FormPost model) {
            throw new NotImplementedException();
        }
    }
}
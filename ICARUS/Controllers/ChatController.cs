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
using System.Text.RegularExpressions;

namespace ICARUS.Controllers {

    /// <summary>
    /// Handles loading of web forms.  Requires authorization
    /// </summary>
    public class ChatController : ContainerController {

        public ChatController() : base("CHAT") {

        }

        /// <summary>
        /// Instantiate a Container using Article defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            var obj = (formPost == null)
                ? new CHAT()
                : new CHAT(formPost);

            obj.setAuthorId(User.Identity.Name);
            return obj;
        }

        /// <summary>
        /// Select a single Main element
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public override Container select(ObjectDBContext ctx, int id) {
            return ctx.Chats.AsQueryable().Single(FilterById(id));
        }

        /// <summary>
        /// Select a single Main element
        /// </summary>
        /// <param name="ctx"></param>
        /// <returns></returns>
        public override IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.Chats.Where(FilterAllowed());
        }

        /// <summary>
        /// Create an instance of a Container on the database based on the given formPost
        /// </summary>
        /// <param name="formPost"></param>
        /// <returns></returns>
        [HttpPost, ValidateAntiForgeryToken, Authorize]
        public async Task<ActionResult> Talk(FormPost formPost) {
            // Set formPost attributes where applicable
            formPost.formId = 1; // Unique to Chat
            formPost.authorId = User.Identity.Name;
            formPost.version = 20180104.001;
            // https://stackoverflow.com/questions/114983/given-a-datetime-object-how-do-i-get-an-iso-8601-date-in-string-format
            formPost.timestamp = DateTime.UtcNow.ToString("s", System.Globalization.CultureInfo.InvariantCulture);

            // Lets add some metadata to the post
            var message = new StringBuilder();
            try {
                Regex rgx = new Regex("[^a-zA-Z -]");
                //str = rgx.Replace(str, "");

                var statement = Regex.Replace(formPost.results[0].value.Trim(), @"[\d-]", "");
                statement = rgx.Replace(formPost.results[0].value.Trim(), "");
                var statementArray = statement.Split(' ');

                formPost.results.Add(new FormValue("Count", statementArray.Count().ToString()));

                
                message.Append("Summary:<br>");
                message.Append("<ul>");

                /*
                 * Map-Reduce
                 * 
                 * Technically, each word should also be reduced down to its associated
                 * wordId.
                 * 
                 */
                foreach (var word in statementArray) {

                    var words = from wrd in statementArray
                        where wrd.ToLower() == word.ToLower()
                        select wrd.ToLower();

                    FormValue formValue = new FormValue(word.ToLower(), words.Count().ToString());

                    // Loop through and check if exists
                    var hasWord = false;
                    for (var w = 0; w < formPost.results.Count; w++) {
                        if (formPost.results[w].name == word.ToLower()) {
                            hasWord = true;
                            break;
                        }
                    }
                    if (hasWord == false) {
                        formPost.results.Add(formValue);
                        message.Append(
                            "<li>"
                            + "<a href=\"http://www.dictionary.com/browse/"+formValue.name+ "?s=t\"  target=\"_blank\">" + formValue.name + "[0]</a>:" 
                            + formValue.value 
                            + "<br>"
                            + "<cite style=\"font-size:small;\">"
                            + "<a href=\"https://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + formValue.name + "?key=7f0d3743-cd0f-4c39-a11e-429184a376d1\" target=\"_blank\">Dictionary</a>"
                            + "&nbsp;|&nbsp;"
                            + "<a href=\"https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/" + formValue.name + "?key=7f1eee46a-0757-408b-a42e-7da3dcaf394a\" target=\"_blank\">Thesaurus</a>"
                            + "</cite>"
                            + "</li>");
                    }
                }

                message.Append("</ul>");

                // This will cause an exception if given values are not XML friendly
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
                        message = message.ToString(), //formPost.getMessage(),
                        formPost = formPost
                    });

                } catch (Exception e) {
                    // Return the form for debugging
                    return Json(new { text = "fail", message = e.Message, form = formPost, exception = e.ToString() });
                }

            } catch (Exception ee) {
                return Json(new Payload(1,
                    "I'm sorry, but I don't understand. :(",
                    ee
                )); //formPost.getMessage(), formPost = formPost
            }
        }
    }
}
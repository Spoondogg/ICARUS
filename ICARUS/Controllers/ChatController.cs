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
using ICARUS.Models.Icarus.Dictionary;

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
            formPost.formId = 1; // Unique to Chat - Represents a sentence
            formPost.authorId = User.Identity.Name;
            formPost.version = 20180104.001;
            // https://stackoverflow.com/questions/114983/given-a-datetime-object-how-do-i-get-an-iso-8601-date-in-string-format
            formPost.dateCreated = DateTime.UtcNow;

            // Lets add some metadata to the post
            var message = new StringBuilder();
            var response = new StringBuilder();

            try {
                Regex rgx = new Regex("[^a-zA-Z -]");

                var statement = Regex.Replace(formPost.results[0].value.Trim(), @"[\d-]", "");
                statement = rgx.Replace(formPost.results[0].value.Trim(), "");
                var statementArray = statement.Split(' ');

                // Get word id and map/reduce


                formPost.results.Add(new FormValue("statement-array", "ARRAY", string.Join(",", statementArray)));

                formPost.results.Add(new FormValue("Count", statementArray.Count().ToString()));

                
                message.Append("Summary:<br>");
                message.Append("<cite>Statement has " + statementArray.Count() + " words</cite>");
                message.Append("<ul>");

                response.Append("<h5>Response</h5>");
                response.Append("<ul>");

                List<FormValue> uniqueWords = new List<FormValue>();

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

                    // Loop through and check if exists
                    var hasWord = false;
                    for (var w = 0; w < formPost.results.Count; w++) {
                        if (formPost.results[w].name == word.ToLower()) {
                            hasWord = true;
                            break;
                        }
                    }

                    // If the word does not exist, add to the array
                    if (hasWord == false) {
                        uniqueWords.Add(
                           new FormValue(word.ToLower(), words.Count().ToString())
                        );
                    }
                }

                // Iterate over unique words
                for(var uw = 0; uw < uniqueWords.Count(); uw++) {
                    message.Append(
                        "<li>"
                        + "<a href=\"http://www.dictionary.com/browse/" + uniqueWords[uw].name + "?s=t\" target=\"_blank\">" + uniqueWords[uw].name + "[0]</a>:"
                        + uniqueWords[uw].value
                        + "<br>"
                        + "<cite style=\"font-size:small;\">"
                        + "<a href=\"https://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + uniqueWords[uw].name + "?key=7f0d3743-cd0f-4c39-a11e-429184a376d1\" target=\"_blank\">Dictionary</a>"
                        + "&nbsp;|&nbsp;"
                        + "<a href=\"https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/" + uniqueWords[uw].name + "?key=7f1eee46a-0757-408b-a42e-7da3dcaf394a\" target=\"_blank\">Thesaurus</a>"
                        + "</cite>"
                        + "</li>");

                    // Check if word exists in the dictionary and add it if it does not
                    // TODO: Call stored procedure outside of this ...???
                    // This will get called redundantly
                    
                    Payload results = this.updateDictionary(uniqueWords[uw].name);
                    //if (results.result > 0) {
                        message.Append(
                            "<li>" + results.message + "</li>"
                        );
                    //}

                }

                message.Append("</ul>");
                response.Append("</ul>");                

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
                        message = message.ToString() + response.ToString(), //formPost.getMessage(),
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


        /// <summary>
        /// Checks if given word exists in dictionary and updates if able to
        /// </summary>
        /// <returns></returns>
        //[Authorize]
        public Payload updateDictionary(string word) {
            
            List<string> columns = new List<string>();
            columns.Add("id");
            columns.Add("word");

            List<Param> parameters = new List<Param>();
            parameters.Add(new Param(1, "word", word));

            Procedure procedure = new Procedure("LINGU.GetWordId", columns, parameters);
            List<Dictionary<string,object>> callWordId = this.Call(procedure);

            Payload results;
            int wordId = 0;

            // Try to extract result
            try {
                results = new Payload(1, "WordId:'" + callWordId[0]["id"].ToString() + "'");

            // If unable to get result, it must not exist
            } catch(Exception wid) {
                //results = new Payload(0, "WordId: NULL", wid);

                // Try to ADD the word to the list
                try {

                    FormPost formPost = new FormPost();
                    formPost.id = 2; //
                    formPost.formId = 2;
                    formPost.authorId = User.Identity.Name;
                    formPost.version = 20180104.001;
                    formPost.status = 1;
                    formPost.dateCreated = DateTime.UtcNow;
                    formPost.results = new List<FormValue>();
                    formPost.xmlResults = "<root></root>";
                    formPost.resultsToXml();
                    formPost.jsonResults = "";

                    formPost.results.Add(new FormValue("value", word));
                    formPost.resultsToXml();

                    getObjectDbContext().FormPosts.Add(formPost);
                    int success = getObjectDbContext().SaveChanges();

                    results = new Payload(1, "Added Word '" + word + "' as a FormPost (FormId:2)", wid);

                } catch (Exception e) {
                    results = new Payload(
                        0, "Unknown exception for Word '" + word + "'<br><br>" + e.Message.ToString(), e
                    );
                }


            }

            
            /*            
            if (wordId[0]["id"] == "") {
                try {

                    FormPost formPost = new FormPost();
                    formPost.id = 2; //
                    formPost.formId = 2;
                    formPost.authorId = User.Identity.Name;
                    formPost.version = 20180104.001;
                    formPost.status = 1;
                    formPost.timestamp = DateTime.UtcNow.ToString(
                        "s",
                        System.Globalization.CultureInfo.InvariantCulture
                    );
                    formPost.results = new List<FormValue>();
                    formPost.xmlResults = "<root></root>";
                    formPost.resultsToXml();
                    formPost.jsonResults = "";

                    formPost.results.Add(new FormValue("value", word));
                    formPost.resultsToXml();

                    getObjectDbContext().FormPosts.Add(formPost);
                    int success = getObjectDbContext().SaveChanges();
                    
                    results = new Payload(1, "Added Word '" + word + "'{"+ wordId[0]["wordId"]+"} as a FormPost (FormId:2)");

                } catch (Exception e) {
                    results = new Payload(
                        0, "Unknown exception for Word '" + word + "'<br><br>" + e.Message.ToString(), e
                    );
                }
            } else {
                results = new Payload(
                    0, "LINGU.GetWordId return the following: '" + word + "'{" + wordId[0]["wordId"] + "}"
                );

            }
            */

            return results;
        }
    }
}
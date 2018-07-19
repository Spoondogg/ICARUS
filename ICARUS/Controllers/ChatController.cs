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
            //formPost.label = "Sentence";
            // https://stackoverflow.com/questions/114983/given-a-datetime-object-how-do-i-get-an-iso-8601-date-in-string-format
            formPost.dateCreated = DateTime.UtcNow;
            formPost.dateLastModified = DateTime.UtcNow;

            // Lets add some metadata to the post
            var message = new StringBuilder();

            try {
                Regex rgx = new Regex("[^a-zA-Z -]");

                var statement = Regex.Replace(formPost.results[0].value.Trim(), @"[\d-]", "");
                statement = rgx.Replace(formPost.results[0].value.Trim(), "");
                var statementArray = statement.Split(' ');

                // Get word id and map/reduce
                formPost.results.Add(new FormValue("statement-array", "ARRAY", string.Join(",", statementArray)));
                formPost.results.Add(new FormValue("Count", statementArray.Count().ToString()));
                
                

                List<FormValue> uniqueWords = new List<FormValue>();

                /*
                 * Map-Reduce
                 * 
                 * Each word is reduced down to its associated wordId.
                 * The question is how this will scale on the database.
                 * I may need to create some sort of cache for the dictionary
                 * 
                 */
                foreach (var word in statementArray) {

                    // Generate a query to find this word
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

                /**
                 * Now that an array of unique words exists,
                 * iterate over each unique word and perform
                 * any required tasks
                */
                message.Append(
                    "<h2>Summary</h2>"
                    + "<cite>Statement has " + statementArray.Count() + " words and "
                    + uniqueWords.Count() + " unique words</cite>"
                    + "<ul class=\"nav-pills dropup\">"
                );

                // Get or Set each word on the database and update message accordingly
                for (var uw = 0; uw < uniqueWords.Count(); uw++) {
                    Payload results = this.updateDictionary(uniqueWords[uw].name);
                    uniqueWords[uw].value = results.result.ToString();
                    message.Append(
                        "<li>"
                        + "<a class=\"dropdown toggle\" data-toggle=\"dropdown\" href=\"#\">" + uniqueWords[uw].name + "</a>"
                        + "<ul class=\"dropdown-menu word-summary\">"
                            + "<li><a href=\"http://www.dictionary.com/browse/" + uniqueWords[uw].name 
                            + "?s=t\" target=\"_blank\">" + uniqueWords[uw].name + "["+ results.result+"]</a>"
                            + "</li>"
                            //+ "<cite style=\"font-size:small;\">"
                            + "<li><a href=\"https://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + uniqueWords[uw].name + "?key=7f0d3743-cd0f-4c39-a11e-429184a376d1\" target=\"_blank\">Dictionary</a></li>"
                            //+ "&nbsp;|&nbsp;"
                            + "<li><a href=\"https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/" + uniqueWords[uw].name + "?key=7f1eee46a-0757-408b-a42e-7da3dcaf394a\" target=\"_blank\">Thesaurus</a></li>"
                            //+ "</cite>"
                        +"</ul>"
                        + "</li>"
                    );
                }
                message.Append("</ul>");

                // This will cause an exception if given values are not XML friendly
                formPost.resultsToXml(); 
                formPost.jsonResults = "";

                // Attempt to save the form to the database
                try {
                    getObjectDbContext().FormPosts.Add(formPost);
                    int success = getObjectDbContext().SaveChanges();
                    return Json(new {
                        text = "Successfully added the FormPost (FormId: "
                            + formPost.formId+") with a response of " + success,
                        message = message.ToString(),
                        formPost = formPost
                    });

                } catch (Exception e) {
                    return Json(new {
                        text = "Failed to add the FormPost.  Returning Form object for debugging.",
                        message = e.Message, form = formPost, exception = e.ToString()
                    });
                }

            } catch (Exception ee) {
                return Json(new Payload(1,
                    "I'm sorry, but I don't understand. :(",
                    ee
                ));
            }
        }


        /// <summary>
        /// Checks if given word exists in dictionary.  
        /// If it does not, the word is added.
        /// 
        /// TODO:  
        /// Add additional validation to ensure that 
        /// garbage words do not make their way into the dictionary.
        /// </summary>
        /// <returns>A payload containing details of the attempt to update the Dictionary.  Payload.result represent the word's unique Id.</returns>
        [Authorize]
        public Payload updateDictionary(string word) {
            try {
                List<string> columns = new List<string>();
                columns.Add("id");
                columns.Add("word");

                List<Param> parameters = new List<Param>();
                parameters.Add(new Param(1, "word", word));

                Procedure procedure = new Procedure("LINGU.GetWordId", columns, parameters);
                List<Dictionary<string, object>> callWordId = this.Call(procedure);

                int wordId = (int) callWordId[0]["id"];
                return new Payload(wordId, "WordId:'" + wordId + "'");

            // If unable to get result, it must not exist
            } catch(Exception wid) {
                return addWordFormPost(word);         
            }
        }

        /// <summary>
        /// Attempt to add the given Word to the Dictionary via FormPost
        /// </summary>
        /// <param name="word"></param>
        /// <returns>A Payload containing server response</returns>
        private Payload addWordFormPost(string word) {
            try {

                FormPost formPost = new FormPost();
                formPost.id = 2; //
                formPost.formId = 2;
                formPost.authorId = User.Identity.Name;
                //formPost.label = "Word";
                formPost.status = 1;
                formPost.dateCreated = DateTime.UtcNow;
                formPost.dateLastModified = DateTime.UtcNow;
                formPost.results = new List<FormValue>();
                formPost.results.Add(new FormValue("value", word));
                formPost.resultsToXml();

                getObjectDbContext().FormPosts.Add(formPost);
                int success = getObjectDbContext().SaveChanges();

                return new Payload(formPost.id, "Successfully added Word '" + word + "' as a FormPost (FormId:2, new WordId: " + formPost.id + ")");

            } catch (Exception e) {
                return new Payload(
                    0, "Unknown exception for Word '" + word + "'<br><br>" + e.Message.ToString(), e
                );
            }
        }
    }
}
 
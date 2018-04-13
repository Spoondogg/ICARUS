using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace ICARUS.Models.Icarus {

    /// <summary>
    /// An Icarus Form Post Object.  This represents the STATE of the form and can be loaded into an existing form, 
    /// assuming the schema matches.  Consider writing parsing methods
    /// </summary>
    public class FormPost {

        /// <summary>
        /// Unique id for this post
        /// </summary>
        [Range(0, int.MaxValue)]
        public int id { get; set; }

        /// <summary>
        /// Form that this post belongs to
        /// </summary>
        [Range(0, int.MaxValue)]
        public int formId { get; set; }

        /// <summary>
        /// Time that form was created
        /// </summary>
        /// //[Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string timestamp { get; set; }

        /// <summary>
        /// The Form Version Number 
        /// </summary>
        public double version { get; set; }

        /// <summary>
        /// Unique Id of author
        /// </summary>
        [StringLength(128), Required]
        public string authorId { get; set; }
        
        /// <summary>
        /// Initial results passed by form. (Eventually parsed into XML)
        /// The contents of this list are stored in [ICARUS].[FormValues]
        /// </summary>
        public List<FormValue> results { get; set; }

        /// <summary>
        /// XML form data
        /// </summary>
        [Required]
        [Column(TypeName = "xml")]
        public string xmlResults { get; set; }

        /// <summary>
        /// A message to be sent back to the client
        /// </summary>
        private string message { get; set; }

        /// <summary>
        /// The results variable is converted to xml
        /// </summary>
        private XmlDocument xml { get; set; }
        
        /// <summary>
        /// Construct an XML object and message body based on the set form post results 
        /// </summary>
        public void resultsToXml() {
            if(this.xml == null) {
                StringBuilder xmlResults = new StringBuilder();
                StringBuilder messageBody = new StringBuilder();
                if (this.results.Count > 0) {

                    xmlResults.Append("<root ");
                    xmlResults.Append("id=\"" + this.id.ToString());
                    //xmlResults.Append("class=\"" + formPost.className.ToString());
                    //xmlResults.Append("name=\"" + formPost.name.ToString());
                    xmlResults.Append("\">");
                    messageBody.Append("<dl>");

                    // Loop through each form value and create an XML node as key/value pairs
                    foreach (FormValue frmVal in this.results) {
                        if (frmVal.name != "__RequestVerificationToken") {
                            xmlResults.Append("<" + frmVal.name + ">" + frmVal.value + "</" + frmVal.name + ">");
                            messageBody.Append("<dt>" + frmVal.name + "</dt><dd>" + frmVal.value + "</dd><br/>");
                        }
                    }
                    xmlResults.Append("</root>");
                    messageBody.Append("</dl>");

                    this.xmlResults = xmlResults.ToString();
                    this.message = messageBody.ToString();
                    this.results = null;

                    XmlDocument xml = new XmlDocument();
                    xml.LoadXml(this.xmlResults);
                    this.xml = xml;
                }
            }            
        }

        /// <summary>
        /// Returns the message
        /// </summary>
        /// <returns></returns>
        public string getMessage() {
            return this.message;
        }

        /// <summary>
        /// Construct a generic form post
        /// </summary>
        public FormPost() {

        }

        /// <summary>
        /// Returns the xml document (if exists)
        /// </summary>
        /// <returns></returns>
        public XmlDocument getXml() {
            if(this.xml == null) {
                this.resultsToXml();
            }
            return this.xml;
        }

        /// <summary>
        /// Extracts an integer for a formpost xml value
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public int parseInt(string key, int defaultValue = 0) {
            int i;
            try {
                i = Int32.Parse(this.getXml().GetElementsByTagName(key)[0].InnerText);
            } catch (Exception e) {
                i = defaultValue;
            }
            return i;
        }

        /// <summary>
        /// Extracts a string for a formpost xml value
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public string parseString(string key, string defaultValue = "") {
            string i;
            try {
                i = this.getXml().GetElementsByTagName(key)[0].InnerText;
            } catch (Exception e) {
                i = defaultValue;
            }
            return i;
        }
    }
}
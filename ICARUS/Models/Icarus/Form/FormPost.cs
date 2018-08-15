using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Web.Script.Serialization;
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
        /// The DateTime that this element was created
        /// </summary>
        [Required]
        public DateTime dateCreated { get; set; }

        /// <summary>
        /// The DateTime that this element was last modified
        /// </summary>
        [Required]
        public DateTime dateLastModified { get; set; }

        /// <summary>
        /// A simple identifier
        /// </summary>
        //[StringLength(128), Required]
        //public string label { get; set; }

        /// <summary>
        /// Unique Id of author
        /// </summary>
        [StringLength(128), Required]
        public string authorId { get; set; }

        /// <summary>
        /// Indicates if the object is active/inactive on the database, 
        /// or any other states that might be needed
        /// </summary>
        [Required]
        public int status { get; set; }

        /// <summary>
        /// Indicates if the object is active/inactive on the database, 
        /// or any other states that might be needed
        /// </summary>
        [Required]
        public int shared { get; set; }

        /// <summary>
        /// Initial results passed by form. (Eventually parsed into XML)
        /// The contents of this list are stored in [ICARUS].[FormValues]
        /// </summary>
        public List<FormValue> results { get; set; }

        /// <summary>
        /// XML form data
        /// </summary>
        [Required, Column(TypeName = "xml")]
        public string xmlResults { get; set; }

        /// <summary>
        /// JSON form data
        /// </summary>
        //[Required]
        //[StringLength(4000)]
        public string jsonResults { get; set; }

        /// <summary>
        /// A message to be sent back to the client
        /// </summary>
        private string message { get; set; }

        /// <summary>
        /// The results variable is converted to xml
        /// </summary>
        private XmlDocument xml = null; //{ get; set; }

        /// <summary>
        /// Construct an XML object and message body based on the set form post results 
        /// </summary>
        public void resultsToXml() {
            if(this.xml == null) {
                StringBuilder xmlResults = new StringBuilder();
                StringBuilder messageBody = new StringBuilder();
                if (this.results.Count > 0) {

                    xmlResults.Append("<root ");
                    if (this.formId > 0) {
                        xmlResults.Append("id=\"" + this.formId.ToString());
                    } else {
                        xmlResults.Append("id=\"" + this.id.ToString());
                    }
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
                    
                    XmlDocument xml = new XmlDocument();
                    xml.LoadXml(this.xmlResults);
                    this.xml = xml;

                    JavaScriptSerializer jsonSerialiser = new JavaScriptSerializer();
                    this.jsonResults = jsonSerialiser.Serialize(this.results);
                    if (this.jsonResults == null) {
                        this.jsonResults = "[]";
                    } else { // Remove the last entry (Should be antiforgerytoken)
                        try {
                            JArray json = JArray.Parse(this.jsonResults);
                            json.Last.Remove();
                            this.jsonResults = json.ToString(Newtonsoft.Json.Formatting.None);
                        } catch (Exception e) {
                            this.jsonResults = "[]";
                        }                        
                    }
                    this.results = null;
                }
            }            
        }

        /// <summary>
        /// Construct an XML object and message body based on the set form post results 
        /// </summary>
        public Dictionary<string, object> resultsToDictionary() {

            Dictionary<string, object> results = new Dictionary<string, object>();
            if (this.results.Count > 0) {
                foreach (FormValue frmVal in this.results) {
                    results.Add(frmVal.name, frmVal.value);
                }
            }
            return results;
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
            this.status = 1;
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

        public void setXml() {
            XmlDocument xml = new XmlDocument();
            xml.LoadXml(this.xmlResults);
            this.xml = xml;
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
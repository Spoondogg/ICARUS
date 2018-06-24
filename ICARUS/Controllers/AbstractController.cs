using ICARUS.Helpers;
using ICARUS.Models;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects.DataClasses;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Xml;

namespace ICARUS.Controllers {

    /// <summary>
    /// An enumerated list of GET Request Result codes
    /// These should really just be web 200, 300 and 400 codes, but start simple
    /// </summary>
    enum GetResults {
        Fail = 0,
        Success = 1
    };

    /// <summary>
    /// An abstract Controller Item that contains abstract async methods required 
    /// for RESTful actions.
    /// 
    /// A RESTful API explicitly takes advantage of HTTP methodologies defined by 
    /// the RFC 2616 protocol. They use GET to retrieve a resource; PUT to change 
    /// the state of or update a resource, which can be an object, file or block; 
    /// POST to create that resource; and DELETE to remove it.
    /// 
    /// </summary>
    /// <see cref="http://searchmicroservices.techtarget.com/definition/RESTful-API"/>
    //[Authorize(Roles = "User,Dev,Admin")]
    public abstract class AbstractController : Controller {

        /// <summary>
        /// Key reference for ObjectDbContext.class ie: ObjectDbContext.Articles would use "Article"
        /// </summary>
        public string className;

        public AbstractController(string className) {
            this.className = className;
        }

        /// <summary>
        /// Object Database Context allows querying of the object database
        /// </summary>
        public ObjectDBContext db = new ObjectDBContext();
        
        /// <summary>
        /// Returns the Object DB Context
        /// </summary>
        /// <returns></returns>
        public ObjectDBContext getObjectDbContext() {
            return this.db;
        }

        /// <summary>
        /// Asynchrounously create the object on the database and return an instance of
        /// it to the user as a JSON object model
        /// </summary>
        /// <returns></returns>
        [HttpPost, ValidateAntiForgeryToken, Authorize(Roles = "Dev,Admin")]
        public abstract Task<ActionResult> Create();

        /// <summary>
        /// Asynchrounously create the object on the database and return an instance of
        /// it to the user as a JSON object model
        /// </summary>
        /// <returns></returns>
        [HttpPost, ValidateAntiForgeryToken, Authorize(Roles = "Dev,Admin")]
        public abstract Task<ActionResult> Create(FormPost formPost);

        /// <summary>
        /// Asynchrounously retrieve the object on the database and return an instance of
        /// it to the user as a JSON object model
        /// There is no token to authenticate on a GET request
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet] //Authorize(Roles = "Dev,Admin")
        public virtual async Task<ActionResult> Get(int id = 0) {
            if (id == 0) {
                return await this.Create();
            } else {
                try {
                    return getJson(id);
                } catch (Exception e) {
                    string message = "Failed to GET " + this.className + "("+id+")\n" + e.Message.ToString();
                    return Json(new Payload(
                        0, message, e
                    ), JsonRequestBehavior.AllowGet);
                }
            }
        }

        /// <summary>
        /// Constructs the object and returns as Json
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public virtual JsonResult getJson(int id) {            
            EL model = (EL)db.dbSets[this.className].Find(id);
            if (model.authorId == User.Identity.Name || model.shared == 1) {

                string message = "Successfully retrieved " + this.className + ", subsections (" +
                    model.subsections + ")";

                // Parse subsection Id's and Retrieve any relevant children 
                string[] subsections = model.subsections.Split(',');
                try {
                    // Append all children (that extend from Container)
                    for (int s = 0; s < subsections.Length; s++) {
                        var child = db.dbSets["Container"].Find(Int32.Parse(subsections[s]));
                        EL ch = (EL)child;
                        if (ch.getAuthorId() == User.Identity.Name || ch.shared == 1) {
                            model.addChild(child);
                        }
                    }
                } catch (Exception ex) { /*message += "\n No children exist or " + ex.Message; */ }

                // Attach formPost (if exists)
                if (model.dataId > 0) {
                    FormPost data = (FormPost)db.dbSets["FormPost"].Find(model.dataId);

                    if (data.authorId == User.Identity.Name || data.shared == 1) {
                        XmlDocument xml = new XmlDocument();
                        xml.LoadXml(data.xmlResults);

                        XmlNodeList node = xml.SelectNodes("/root/*");
                        foreach (XmlNode xn in node) {
                            model.data.Add(xn.Name, xn.InnerText);
                        }
                    }
                }

                // Attach formPost (if exists)
                if (model.attributesId > 0) {
                    FormPost attributes = (FormPost)db.dbSets["FormPost"].Find(model.attributesId);

                    if(attributes.authorId == User.Identity.Name || attributes.shared == 1) {
                        XmlDocument xml = new XmlDocument();
                        xml.LoadXml(attributes.xmlResults);

                        XmlNodeList node = xml.SelectNodes("/root/*");
                        foreach (XmlNode xn in node) {
                            model.attributes.Add(xn.Name, xn.InnerText);
                        }
                    }                    
                }

                // Attach formPost (if exists)
                if (model.descriptionId > 0) {
                    FormPost description = (FormPost)db.dbSets["FormPost"].Find(model.descriptionId);

                    if (description.authorId == User.Identity.Name || description.shared == 1) {
                        XmlDocument xml = new XmlDocument();
                        xml.LoadXml(description.xmlResults);

                        XmlNodeList node = xml.SelectNodes("/root/*");
                        foreach (XmlNode xn in node) {
                            model.attributes.Add(xn.Name, xn.InnerText);
                        }
                    }
                }

                // Return the fully constructed model
                return Json(new Payload(
                    1, this.className, model,
                    message
                ), JsonRequestBehavior.AllowGet);

            } else {
                string message = User.Identity.Name + ", You do not have permission to access this " + this.className;
                return Json(new Payload(
                    0, message, new Exception(message)
                ), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Asynchrounously modify the object on the database and return an instance of
        /// it to the user as a JSON object model
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost, ValidateAntiForgeryToken, Security] //Authorize
        public abstract Task<ActionResult> Set(FormPost formPost);

        /// <summary>
        /// Asynchrounously set the given object's active state to false if the user is the 
        /// author of this object.
        /// 
        /// Be sure to update any dependant objects as well, or prevent the change
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        //[HttpGet]  // TODO: Secure as HttpPost 
        [HttpPost, ValidateAntiForgeryToken, Security] //Authorize
        public virtual async Task<ActionResult> Delete(int id) {
            string message = "";
            try {
                // Retrieve the existing object and a temporary object
                var mdl = db.dbSets[this.className].Find(id);
                var model = (EL)mdl;

                // Verify ownership and process deletion
                if (model.getAuthorId() == User.Identity.Name) {
                    db.dbSets[className].Attach(mdl);
                    db.dbSets[className].Remove(mdl);
                    getObjectDbContext().SaveChanges();

                    message = "Successfully deleted " + this.className + "(" + id + ")";

                    return Json(new Payload(
                        Int32.Parse(GetResults.Success.ToString()), 
                        message
                    ), JsonRequestBehavior.AllowGet);
                } else {
                    message = "Failed to delete " + this.className + "(" + id
                    + ")\nYou do not have permissions to modify this " + this.className;

                    return Json(new Payload(
                        Int32.Parse(GetResults.Fail.ToString()),
                        message
                    ), JsonRequestBehavior.AllowGet);
                }
            } catch (Exception e) {
                return Json(new Payload(
                    Int32.Parse(GetResults.Fail.ToString()), e.Message, e), JsonRequestBehavior.AllowGet
                );
            }
        }

        /// <summary>
        /// Calls a stored procedure from the server
        /// http://stackoverflow.com/questions/39587606/how-to-call-and-execute-stored-procedures-in-asp-net-mvcc
        /// for the current user
        /// </summary>
        /// <returns></returns>
        //[HttpPost] // TODO: Restore POST??
        [Authorize]
        public List<Dictionary<string, string>> Call(Procedure procedure) {

            procedure.authorId = User.Identity.Name;

            string cnnString = System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

            SqlConnection cnn = new SqlConnection(cnnString);
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = cnn;
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = procedure.name;

            // Add basic parameters as required. 
            // All Procedures should start with authorId as the default param
            cmd.Parameters.AddWithValue("authorId", User.Identity.Name);
            foreach(var param in procedure.parameters) {
                cmd.Parameters.AddWithValue(param.name, param.value);
            }

            cnn.Open();


            List<Dictionary<string, string>> records = new List<Dictionary<string, string>>();

            try {
                SqlDataReader reader = cmd.ExecuteReader();
                var cols = procedure.columns;
                while (reader.Read()) {
                    var row = new Dictionary<string, string>();
                    foreach (var col in cols) {
                        var key = col;
                        row.Add(key, reader[key].ToString());
                    }
                    records.Add(row);
                }
            } catch (Exception e) {
                var row = new Dictionary<string, string>();
                row.Add("Exception", e.Message);
            }            

            cnn.Close();

            return records;
        }
    }
}

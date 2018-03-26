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

        /*
        /// <summary>
        /// Retrieves a JSON formatted FORM object from the server based on the
        /// given FORM ID
        /// </summary>
        /// <param name="id">The unique form Id</param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "Dev,Admin")]
        public ActionResult FormObject(int id) {

            // Retrieve the Generic Form object from the database with the given ID
            var formQuery = from form in getObjectDbContext().Forms
                            where form.id == id && form.authorId == User.Identity.Name
                            //orderby form.label
                            select form;
            var dbForm = formQuery.FirstOrDefault<Form>();

            // Construct the Icarus Form Object to return
            IcarusForm iForm = new IcarusForm(User.Identity.Name, dbForm.id, dbForm.label);

            // Retrieve any relevant form groups for the given ID
            var groupIdQuery = from grpId in dbForm.subsections.Split(',')
                               where dbForm.subsections != ""
                               select int.Parse(grpId);

            // Append each group (id) to the array list
            foreach (int num in groupIdQuery) {

                // Retrieve each group
                var formGroupQuery = from grp in getObjectDbContext().FieldSets
                                     where grp.id == num && grp.getAuthorId() == User.Identity.Name
                                     orderby grp.label
                                     select grp;

                // Add each generic form-group to the Icarus Form
                foreach (var formGroupObj in formGroupQuery) {

                    IcarusFieldSet group = new IcarusFieldSet(User.Identity.Name, formGroupObj.id, formGroupObj.label);

                    // Retrieve any relevant form elements for the given ID
                    var formElementIdQuery = from frmElId in formGroupObj.subsections.Split(',')
                                             where formGroupObj.subsections != ""
                                             select int.Parse(frmElId);

                    // Append each formelement (id) to the array list
                    foreach (int elNum in formElementIdQuery) {
                        
                        // Retrieve child form-elements for this group
                        var formElementQuery = from elem in getObjectDbContext().FormElements
                                               where elem.id == elNum && elem.authorId == User.Identity.Name
                                               select elem;

                        // Add each form-element to the group
                        foreach (FormElement el in formElementQuery) {

                            // Instantiate the form element
                            IcarusFormElement formEl = new IcarusFormElement(User.Identity.Name, el.id, el.tagId, el.typeId, el.name, el.label);

                            // TODO: Retrieve child options for this element (if tag == <select>)
                            if (el.tagId == 2) {

                                // Retrieve any relevant form elements for the given ID
                                var formElementOptionIdQuery = from frmElOptId in el.options.Split(',')
                                                               where el.options != ""
                                                               select int.Parse(frmElOptId);

                                foreach (int optNum in formElementOptionIdQuery) {
                                    // Retrieve child form-elements for this group
                                    var formElementOptionQuery = from opt in getObjectDbContext().FormElementOptions
                                                                 where opt.id == optNum
                                                                 select opt;

                                    // Add each form-element-option to the group
                                    foreach (FormElementOption op in formElementOptionQuery) {
                                        formEl.addOption(new IcarusFormElementOption(User.Identity.Name, op.id, op.label, op.value, op.childGroupId));
                                    }
                                }
                            }
                            group.addElement(formEl);
                        }
                    }                  

                    // Add the group to the form
                    iForm.children.Add(group);
                }
            }

            // Return the Icarus Form as a JSON object
            return Json(iForm); //JsonRequestBehavior.AllowGet
        }
        */

        /*
        /// <summary>
        /// Retrieves a JSON formatted FORM GROUP object from the server based on the
        /// given FORM GROUP ID
        /// </summary>
        /// <param name="id">The unique form Group Id</param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "User,Dev,Admin")]
        public ActionResult FormGroupObject(int id) {
            
            var dbFormGroup = getObjectDbContext().FieldSets.SingleOrDefault(e => e.id == id);
            IcarusFieldSet formGroup = new IcarusFieldSet(User.Identity.Name, dbFormGroup.id, dbFormGroup.label);

            // Retrieve any relevant form groups for the given ID
            var childElementIdsQuery = from frmElId in dbFormGroup.subsections.Split(',')
                                       where dbFormGroup.subsections != ""
                                       select int.Parse(frmElId);                                       

            // Append each group (id) to the array list
            foreach (int num in childElementIdsQuery) {
                // Retrieve the child form-group elements
                var childElementQuery = from childElement in getObjectDbContext().FormElements
                                        where childElement.id == num
                                        select childElement;

                // Construct the list
                foreach (var childEl in childElementQuery) {
                    //groupItems.Add(new SelectListItem { Value = grp.id.ToString(), Text = grp.label });

                    // Select with options
                    IcarusFormElement formEl = new IcarusFormElement(User.Identity.Name, childEl.id, childEl.tagId, childEl.typeId, childEl.name, childEl.label);

                    // Nested query to pull related formElementOptions
                    var childElementOptionQuery = from childElementOption in getObjectDbContext().FormElementOptions
                                                  where childElementOption.parentId == childEl.id
                                                  select childElementOption;

                    foreach (var childElOption in childElementOptionQuery) {
                        formEl.addOption(new IcarusFormElementOption(User.Identity.Name, childElOption.id, childElOption.label, childElOption.value, childElOption.childGroupId));
                    }

                    // Add the element to the group
                    formGroup.addElement(formEl);
                }
            }           

            // Return the Icarus Form as a JSON object
            return Json(formGroup); //, JsonRequestBehavior.AllowGet
        }
        */

        /*
        /// <summary>
        /// Retrieves a JSON formatted FORM ELEMENT object from the server based on the
        /// given FORM ELEMENT ID
        /// </summary>
        /// <param name="id">The unique form Element Id</param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "User,Dev,Admin")]
        public ActionResult FormElementObject(int id) {
            
            // Retrieve the child form group for the dropdown
            var dbFormElement = getObjectDbContext().FormElements.SingleOrDefault(e => e.id == id);

            // TODO:  Verify:: This may not need to be instantiated...  The results of the preceding query should suffice.  
            IcarusFormElement formElement = new IcarusFormElement(dbFormElement.id, dbFormElement.tagId, dbFormElement.typeId, dbFormElement.name, dbFormElement.label);
            formElement.setAuthorId(User.Identity.Name);

            // Retrieve any relevant form options for the given ID
            var childOptionIdsQuery = from frmElId in dbFormElement.options.Split(',')
                                      where dbFormElement.options != ""
                                      select int.Parse(frmElId);

            // Append each option (id) to the array list
            foreach (int num in childOptionIdsQuery) {
                // Retrieve the child form-element options
                var childOptionQuery = from childOption in getObjectDbContext().FormElementOptions
                                        where childOption.id == num
                                        select childOption;

                // Construct the list
                foreach (var childOpt in childOptionQuery) {
                    //groupItems.Add(new SelectListItem { Value = grp.id.ToString(), Text = grp.label });

                    // Select with options
                    IcarusFormElementOption formEl = new IcarusFormElementOption(User.Identity.Name, childOpt.id, childOpt.label, childOpt.value, childOpt.childGroupId);

                    // Add the element to the group
                    formElement.addOption(formEl);
                }
            }

            // Return the Icarus Form as a JSON object
            return Json(formElement); //, JsonRequestBehavior.AllowGet
        }
        */

        /*
        /// <summary>
        /// Retrieves a JSON formatted FORM GROUP list object from the server 
        /// for the current user
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "User,Dev,Admin")]
        public ActionResult FormGroupsObject(int id = 0) {

            // Retrieve the child form group for the dropdown
            var groups = from s in getObjectDbContext().FieldSets
                         //where s.categoryId == id || id == 0
                         where id == 0
                         orderby s.label
                         select s;

            // Return the Icarus Form as a JSON object
            return Json(groups); //, JsonRequestBehavior.AllowGet
        }
        */

        /*
        /// <summary>
        /// Retrieves a JSON formatted FORM ELEMENT list object from the server 
        /// for the current user
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "User,Dev,Admin")]
        public ActionResult FormElementsObject(int id = 0) {
            var elements = from formElements in getObjectDbContext().FormElements
                         where formElements.categoryId == id || id == 0 //s.authorId == User.Identity.Name
                         //orderby s.label
                         select formElements;

            // Return the Icarus Form Elements as a JSON object
            return Json(elements);
        }
        */

        /*
        /// <summary>
        /// Retrieves a JSON formatted FORM CATEGORY list object from the server 
        /// for the current user
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "User,Dev,Admin")]
        public ActionResult FormCategoriesObject(int id = 0) {

            // Retrieve the child form group for the dropdown
            var categories = from s in getObjectDbContext().FormCategories
                           where s.id == id || id == 0
                           select s;

            // Return the Icarus Form Categories as a JSON object
            return Json(categories); //, JsonRequestBehavior.AllowGet
        }
        */

        /*
        /// <summary>
        /// Retrieves a JSON formatted FORM OPTION list object from the server
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "User,Dev,Admin")]
        public ActionResult FormOptionsObject(int id = 0) {

            // Retrieve the child form element options for the dropdown
            var options = from s in getObjectDbContext().FormElementOptions
                           where s.categoryId == id || id == 0
                           orderby s.label
                           select s;

            // Return the Icarus Form Options as a JSON object
            return Json(options); //, JsonRequestBehavior.AllowGet
        }
        */

        /*
        /// <summary>
        /// Retrieves a JSON formatted form element options list from the server 
        /// for the current user
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "User,Dev,Admin")]
        public ActionResult GetOptions(int id) {

            // Retrieve a set of Form Element Options matching the given Id
            var items = from s in getObjectDbContext().FormElementOptions
                        where s.parentId == id
                        orderby s.label
                        select s;

            // Return the Icarus Form Element Options as a JSON object
            return Json(items); //, JsonRequestBehavior.AllowGet

        }
        */

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
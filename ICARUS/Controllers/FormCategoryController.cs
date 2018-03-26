using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using ICARUS.Models;
using ICARUS.Models.Icarus;

namespace ICARUS.Controllers {

    /// <summary>
    /// Handles loading of web forms.  Requires authorization
    /// </summary>
    [Authorize(Roles = "User,Dev,Admin")]
    public class FormCategoryController : AbstractController {

        public FormCategoryController() : base("FormCategory") {

        }

        /// <summary>
        /// GET: FormElement
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = "Dev,Admin")]
        public ActionResult Index(int id = 0) {
            var categories = from s in getObjectDbContext().FormCategories
                         where (s.id == id || id == 0 ) && s.authorId == User.Identity.Name
                         orderby s.label
                         select s;

            return Json(categories);
        }

        /// <summary>
        /// Action performed when POST request is passed to #/FormElement/create
        /// POST: FormElement/Create
        /// </summary>
        /// <param name="collection">POSTed values</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Create(FormCategory formCategory) {

            try {
                formCategory.authorId = User.Identity.Name;
                getObjectDbContext().FormCategories.Add(formCategory);
                getObjectDbContext().SaveChanges();
                return RedirectToAction("Index");
            } catch {
                return View();
            }
        }

        

        /// <summary>
        /// Returns a list of Categories
        /// </summary>
        /// <returns></returns>
        public List<SelectListItem> getCategoryItems() {

            // Retrieve a list of categories for the category option list
            List<SelectListItem> categoryItems = new List<SelectListItem>();
            var categoryQuery = from categoryItem in getObjectDbContext().FormCategories
                                orderby categoryItem.label
                                select categoryItem;

            // Construct the list
            categoryItems.Add(new SelectListItem { Value = "0", Text = "None" });
            foreach (var category in categoryQuery) {
                categoryItems.Add(new SelectListItem { Value = category.id.ToString(), Text = category.label });
            }

            return categoryItems;
        }

        public override async Task<ActionResult> Create() {
            return Json(new FormCategory());
        }

        public override async Task<ActionResult> Create(FormPost formPost) {
            throw new NotImplementedException();
        }
        
        public override async Task<ActionResult> Set(FormPost model) {
            throw new NotImplementedException();
        }
        

    }

    
}
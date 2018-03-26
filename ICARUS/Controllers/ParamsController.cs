using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ICARUS.Models;

namespace ICARUS.Controllers {

    public class ParamsController : Controller {

        private ObjectDBContext db = new ObjectDBContext();

        /// <summary>
        /// GET: Params
        /// </summary>
        /// <returns></returns>
        public ActionResult Index() {
            return View(db.Params.ToList());
        }

        // GET: Params/Details/5
        public ActionResult Details(int? id){
            if (id == null){
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Param param = db.Params.Find(id);
            if (param == null){
                return HttpNotFound();
            }
            return View(param);
        }

        /// <summary>
        /// GET: Params/Create
        /// </summary>
        /// <returns></returns>
        public ActionResult Create(){

            // Create a basic Param
            Param model = new Param();

            // Populate the types dropdown
            model.types = new ParamTypeList();

            // Retrieve a list of procedures for the procedure option list
            var procedureQuery = from procedure in db.Procedures
                                 where procedure.authorId == User.Identity.Name
                                 select procedure;

            // Construct the list
            List<SelectListItem> procedures = new List<SelectListItem>();
            procedures.Add(new SelectListItem { Value = "0", Text = "None" });
            foreach (var proc in procedureQuery) {
                procedures.Add(new SelectListItem { Value = proc.id.ToString(), Text = proc.label });
            }

            // Populate the model with <select> options
            //Param model = new Param();
            model.procedures = procedures;
            
            return View(model);
        }

        /// <summary>
        /// POST: Params/Create
        /// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        /// more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "id,name,value,type,procedureId")] Param param){

            if (ModelState.IsValid){
                db.Params.Add(param);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(param);
        }

        /// <summary>
        /// GET: Params/Edit/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Edit(int? id){
            if (id == null){
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Param param = db.Params.Find(id);
            if (param == null){
                return HttpNotFound();
            }
            return View(param);
        }

        /// <summary>
        /// POST: Params/Edit/5
        /// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        /// more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "id,name,value,type")] Param param){
            if (ModelState.IsValid){
                db.Entry(param).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(param);
        }

        /// <summary>
        /// GET: Params/Delete/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Delete(int? id){
            if (id == null){
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Param param = db.Params.Find(id);
            if (param == null){
                return HttpNotFound();
            }
            return View(param);
        }

        /// <summary>
        /// POST: Params/Delete/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id){
            Param param = db.Params.Find(id);
            db.Params.Remove(param);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        /// <summary>
        /// Dispose method
        /// </summary>
        /// <param name="disposing"></param>
        protected override void Dispose(bool disposing){
            if (disposing){
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}

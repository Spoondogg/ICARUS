using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ICARUS.Models.Icarus;

namespace ICARUS.Controllers {

    public class LogsController : Controller {
        private ObjectDBContext db = new ObjectDBContext();

        // GET: IcarusLogs
        public ActionResult Index(){
            return View(db.Logs.ToList());
        }

        // GET: IcarusLogs/Details/5
        public ActionResult Details(int? id) {
            if (id == null){
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Log log = db.Logs.Find(id);
            if (log == null){
                return HttpNotFound();
            }
            return View(log);
        }

        // GET: IcarusLogs/Create
        public ActionResult Create(){
            return View();
        }

        // POST: IcarusLogs/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "id,authorId,data")] Log icarusLog){
            if (ModelState.IsValid){
                db.Logs.Add(icarusLog);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(icarusLog);
        }

        // GET: IcarusLogs/Edit/5
        public ActionResult Edit(int? id){
            if (id == null){
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Log icarusLog = db.Logs.Find(id);
            if (icarusLog == null){
                return HttpNotFound();
            }
            return View(icarusLog);
        }

        // POST: IcarusLogs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "id,authorId,data")] Log icarusLog){
            if (ModelState.IsValid){
                db.Entry(icarusLog).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(icarusLog);
        }

        // GET: IcarusLogs/Delete/5
        public ActionResult Delete(int? id){
            if (id == null){
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Log icarusLog = db.Logs.Find(id);
            if (icarusLog == null){
                return HttpNotFound();
            }
            return View(icarusLog);
        }

        // POST: IcarusLogs/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id){
            Log icarusLog = db.Logs.Find(id);
            db.Logs.Remove(icarusLog);
            db.SaveChanges();
            return RedirectToAction("Index");
        }


        protected override void Dispose(bool disposing){
            if (disposing){
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
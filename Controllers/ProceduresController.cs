using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ICARUS.Models.Icarus;
using ICARUS.Models;
using System.Data.SqlClient;

namespace ICARUS.Controllers
{
    public class ProceduresController : Controller{
        private ObjectDBContext db = new ObjectDBContext();

        // GET: Procedures
        public ActionResult Index(){
            return View(db.Procedures.ToList());
        }

        // GET: Procedures/Details/5
        public ActionResult Details(int? id){
            if (id == null){
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Procedure icarusProcedure = db.Procedures.Find(id);
            if (icarusProcedure == null){
                return HttpNotFound();
            }
            return View(icarusProcedure);
        }

        // GET: Tasks/Create
        public ActionResult Create(){
            // Create a basic Param
            Procedure model = new Procedure();
            return View(model);
        }

        // POST: Tasks/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "id,typeId,name,label,columns,parameters,description")] Procedure procedure){

            try {
                procedure.authorId = User.Identity.Name;
                db.Procedures.Add(procedure);
                db.SaveChanges();
                return RedirectToAction("Index");
            } catch {
                return View(procedure);
            }

        }

        // GET: Procedures/Edit/5
        public ActionResult Edit(int? id){
            if (id == null){
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Procedure icarusProcedure = db.Procedures.Find(id);
            if (icarusProcedure == null){
                return HttpNotFound();
            }
            return View(icarusProcedure);
        }

        // POST: Procedures/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [Authorize(Roles = "Dev,Admin")]
        public ActionResult Edit(int id, FormCollection collection) {
            try {
                var procedure = db.Procedures.Single(m => m.id == id);
                if (TryUpdateModel(procedure)) {
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
                return View(procedure);
            } catch {
                return View();
            }
        }

        // GET: Tasks/Delete/5
        public ActionResult Delete(int? id){
            if (id == null){
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Procedure icarusProcedure = db.Procedures.Find(id);
            if (icarusProcedure == null){
                return HttpNotFound();
            }
            return View(icarusProcedure);
        }

        // POST: Tasks/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id){
            Procedure icarusProcedure = db.Procedures.Find(id);
            db.Procedures.Remove(icarusProcedure);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing){
            if (disposing){
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        /*
        /// <summary>
        /// Calls a stored procedure from the server
        /// http://stackoverflow.com/questions/39587606/how-to-call-and-execute-stored-procedures-in-asp-net-mvcc
        /// for the current user
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "User,Dev,Admin")]
        public ActionResult Call(int id) {
            

            // Retrieve the details of the procedure matching the given Id
            var procedure = db.Procedures.Single(m => m.id == id);


            string cnnString = System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

            SqlConnection cnn = new SqlConnection(cnnString);
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = cnn;
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = procedure.name;

            // Add basic parameters as required
            cmd.Parameters.AddWithValue("authorId", User.Identity.Name);

            cnn.Open();

            List<Dictionary<string, string>> records = new List<Dictionary<string, string>>();
            SqlDataReader reader = cmd.ExecuteReader();

            var cols = procedure.columns.Split(',');
            while (reader.Read()) {

                var row = new Dictionary<string, string>();                
                for (var i = 0; i < cols.Length; i++) {
                    var key = cols[i].ToString();
                    row.Add(key, reader[key].ToString());
                }
                //row.Add("result", reader["result"].ToString());
                //row.Add("token", reader["token"].ToString());

                records.Add(row);
            }

            cnn.Close();

            return Json(records);

        }
        */

    }
}

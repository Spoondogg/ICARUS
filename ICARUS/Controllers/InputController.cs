﻿using ICARUS.Models;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Controllers {
       
    /// <summary>
    /// Controller for Form Elements, performs basic CRUD actions as well as
    /// various pages
    /// </summary>
    [Authorize(Roles = "User,Dev,Admin")]
    public class InputController : ContainerController {

        public InputController() : base("Input") {

        }

        /// <summary>
        /// Get Request Index page for Forms
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public override async Task<ActionResult> Index() {
            var models = from s in getObjectDbContext().Inputs
                             where s.authorId == User.Identity.Name
                             orderby s.label
                             select s;

            return Json(new Payload(
                    1, className, models.Take(5),
                    "Index"
                ), JsonRequestBehavior.AllowGet);

        }

        public override async Task<ActionResult> Create() {
            // Attempt to create and save to the database
            try {
                // Save the object
                Input model = new Input();
                model.setAuthorId(User.Identity.Name);

                getObjectDbContext().Inputs.Add(model);
                int result = getObjectDbContext().SaveChanges();

                // Return the success response along with the email message body
                return Json(
                    new Payload(
                        result, className, model, "Successfully created " + className + "(" + model.id + ")"
                    ),
                JsonRequestBehavior.AllowGet);

            } catch (Exception e) {
                return Json(new Payload(0, "Failed to create " + className + "\n" + e.Message, e), JsonRequestBehavior.AllowGet);
            }
        }

        public override async Task<ActionResult> Create(FormPost formPost) {
            try {
                Input model = new Input(formPost);
                model.setAuthorId(User.Identity.Name);

                getObjectDbContext().Inputs.Add(model);
                int results = getObjectDbContext().SaveChanges();

                return Json(new Payload(results, "INPUT", model, "Successfully created " + className));

            } catch (Exception e) {
                return Json(
                    new Payload(
                        0,
                        "Unable to create new instance of " + this.className + "\n"
                        + e.ToString() + "\n\n" + e.Message.ToString(),
                        e
                    ),
                JsonRequestBehavior.AllowGet);
            }
        }
    }
}
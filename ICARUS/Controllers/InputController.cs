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
        /// Instantiate a Container using Main defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            Input obj = (formPost == null)
                ? new Input()
                : new Input(formPost);

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
            Input model = (Input)ctx.Inputs.Single(m =>
                   m.id == id && m.authorId == User.Identity.Name
                );
            return model;
        }
    }
}
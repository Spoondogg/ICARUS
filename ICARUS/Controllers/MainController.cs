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
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq.Expressions;

namespace ICARUS.Controllers {
    /// <summary>
    /// Handles loading of web forms.  Requires authorization
    /// </summary>
    public class MainController : ContainerController {

        public MainController() : base("Main") {
            
        }



        /// <summary>
        /// Instantiate a Container using Main defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            var obj = (formPost == null)
                ? new Main()
                : new Main(formPost);
            
            obj.dateCreated = DateTime.UtcNow;
            obj.dateLastModified = DateTime.UtcNow;

            obj.setAuthorId(User.Identity.Name);
            return obj;
        }
        
        /// <summary>
        /// Select a single element
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public override Container select(ObjectDBContext ctx, int id) {
            return ctx.Mains.AsQueryable().Single(FilterById(id));
        }

        /// <summary>
        /// Select a single element
        /// </summary>
        /// <param name="ctx"></param>
        /// <returns></returns>
        public override IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.Mains.Where(FilterAllowed());
        }
    }
}
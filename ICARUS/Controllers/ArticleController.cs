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
    public class ArticleController : ContainerController {

        public ArticleController() : base("Article") {

        }

        /// <summary>
        /// Instantiate a Container using Article defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            Article obj = (formPost == null)
                ? new Article()
                : new Article(formPost);

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
            Article model = (Article)ctx.Articles.Single(m =>
                   m.id == id && (m.authorId == User.Identity.Name || m.shared == 1)
                );
            return model;
        }
    }
}
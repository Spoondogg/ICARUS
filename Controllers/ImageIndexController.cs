using ICARUS.Models;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Controllers {

    public class ImageIndexController : ContainerController {

        public ImageIndexController() : base("IMAGEINDEX") {

        }

        /// <summary>
        /// Instantiate a Container using List defaults
        /// </summary>
        /// <returns>An image gallery</returns>
        public override Container make(FormPost formPost = null) {
            var obj = (formPost == null)
                ? new IMAGEINDEX()
                : new IMAGEINDEX(formPost);

            obj.setAuthorId(User.Identity.Name);

            return obj;
        }

        /// <summary>
        /// Select a single element
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns>A single ImageIndex Element</returns>
        public override Container select(ObjectDBContext ctx, int id) {
            return ctx.ImageIndexes.AsQueryable().Single(FilterById(id));
        }

        /// <summary>
        /// Select all elements
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns>A collection of elements</returns>
        public override IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.ImageIndexes.Where(FilterAllowed());
        }

        // "http://localhost:8052/JUMBOTRON/Page?page=0&pageLength=2"/>

        /// <summary>
        /// Returns a list of Container Ids that contain this container
        /// </summary>
        /// <returns>An image</returns>
        public virtual async Task<ActionResult> GetImages(
            string page = "0", string pageLength = "10"
        ) {

            int pageLen = Int32.Parse(pageLength);
            pageLen = (pageLen > 50) ? 50 : pageLen;

            List<string> columns = new List<string>();
            columns.Add("id");
            columns.Add("label");
            columns.Add("dateCreated");
            columns.Add("dateLastModified");
            columns.Add("authorId");
            columns.Add("xmlResults");
            columns.Add("jsonResults");
            columns.Add("shared");

            List<Param> parameters = new List<Param>();
            parameters.Add(new Param(1, "pageLength", pageLen));
            parameters.Add(new Param(2, "page", page));

            Procedure procedure = new Procedure("FORMPOST.GetImageList", columns, parameters);

            return Json(this.Call(procedure), JsonRequestBehavior.AllowGet);
        }

        // http://localhost:8052/JUMBOTRON/Page?page=0&pageLength=2 [Authorize]

        /// <summary>
        /// Returns a list of Image Ids
        /// </summary>
        /// <returns>A list of image Ids</returns>        
        public async Task<ActionResult> Index(string page = "0", string pageLength = "10") {

            int pageLen = Int32.Parse(pageLength);
            pageLen = (pageLen > 50) ? 50 : pageLen;

            List<string> columns = new List<string>();
            columns.Add("index");
            columns.Add("id");
            columns.Add("label");

            List<Param> parameters = new List<Param>();
            parameters.Add(new Param(1, "pageLength", pageLen));
            parameters.Add(new Param(2, "page", page));

            Procedure procedure = new Procedure("FORMPOST.GetImageIndex", columns, parameters);

            int total = selectAll(getObjectDbContext()).Where(
                m => m.authorId == User.Identity.Name || m.isPublic == 1
            ).Count();

            Dictionary<string, object> result = new Dictionary<string, object>();
            result.Add("className", "Image");
            result.Add("total", total);
            result.Add("list", this.Call(procedure));

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
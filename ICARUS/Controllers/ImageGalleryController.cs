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

    public class ImageGalleryController : ContainerController {

        public ImageGalleryController() : base("IMAGEGALLERY") {

        }

        /// <summary>
        /// Instantiate a Container using List defaults
        /// </summary>
        /// <returns>An image gallery</returns>
        public override Container make(FormPost formPost = null) {
            var obj = (formPost == null)
                ? new IMAGEGALLERY()
                : new IMAGEGALLERY(formPost);

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
            return ctx.ImageGalleries.AsQueryable().Single(FilterById(id));
        }

        /// <summary>
        /// Select a single element
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public override IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.ImageGalleries.Where(FilterAllowed());
        }

        /// <summary>
        /// Returns a list of Container Ids that contain this container
        /// ie http://localhost:8052/JUMBOTRON/Page?page=0&pageLength=2
        /// [Authorize]
        /// </summary>
        /// <returns></returns>
        public virtual async Task<ActionResult> Image(
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

            Procedure procedure = new Procedure(
                "ICARUS.GetImageList", columns, parameters
            );

            return Json(this.Call(procedure), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a list of Image Ids
        /// ie http://localhost:8052/JUMBOTRON/Page?page=0&pageLength=2
        /// [Authorize]
        /// </summary>
        /// <returns></returns>        
        public async Task<ActionResult> ImageIndex(string page = "0", string pageLength = "10") {

            int pageLen = Int32.Parse(pageLength);
            pageLen = (pageLen > 50) ? 50 : pageLen;

            List<string> columns = new List<string>();
            columns.Add("index");
            columns.Add("id");
            columns.Add("label");

            List<Param> parameters = new List<Param>();
            parameters.Add(new Param(1, "pageLength", pageLen));
            parameters.Add(new Param(2, "page", page));

            Procedure procedure = new Procedure("ICARUS.GetImageIndex", columns, parameters);

            int total = selectAll(getObjectDbContext()).Where(
                m => m.authorId == User.Identity.Name || m.shared == 1
            ).Count();

            Dictionary<string, object> result = new Dictionary<string, object>();
            result.Add("className", "Image");
            result.Add("total", total);
            result.Add("list", this.Call(procedure));

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
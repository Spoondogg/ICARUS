using ICARUS.Models;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Dictionary;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;

namespace ICARUS.Controllers {

    /// <summary>
    /// Database Context for Survey Entries
    /// see p.119
    /// </summary>
    public class ObjectDBContext : DbContext {

        /// <summary>
        /// Key reference for ObjectDbContext.class ie: ObjectDbContext.Articles would use "Article"
        /// </summary>
        public string className;        

        
        public static ObjectDBContext Create() {
            return new ObjectDBContext();
        }

        /// <summary>
        /// Set the default schema
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(DbModelBuilder modelBuilder) {
            modelBuilder.HasDefaultSchema("ICARUS");
            base.OnModelCreating(modelBuilder);
        }

        /// <summary>
        /// DbSets collected into a list for easy retrieval
        /// </summary>
        public Dictionary<string, DbSet> dbSets;

        public Dictionary<string, DbSet<Container>> dbContainerSets;

        // Populate with relevant objects

        public DbSet<Main> Mains { get; set; }
        public object Main { get; internal set; }        

        public DbSet<Container> Containers { get; set; }
        public object Container { get; internal set; }

        public DbSet<CLASSVIEWER> ClassViewers { get; set; }
        public object ClassViewer { get; internal set; }

        public DbSet<IFRAME> IFrames { get; set; }
        public object IFrame { get; internal set; }

        public DbSet<ARTICLE> Articles { get; set; }
        public object Article { get; internal set; }

        public DbSet<SECTION> Sections { get; set; }
        public object Section { get; internal set; }

        // FORM
        public DbSet<FORM> Forms { get; set; }
        public object Form { get; internal set; }

        public DbSet<FIELDSET> FieldSets { get; set; }
        public object FieldSet { get; internal set; }

        public DbSet<FORMELEMENTGROUP> FormElementGroups { get; set; }
        public object FormElementGroup { get; internal set; }

        public DbSet<FormElement> FormElements { get; set; }
        public object FormElement { get; internal set; }

        public DbSet<Input> Inputs { get; set; }
        public object Input { get; internal set; }

        public DbSet<Select> Selects { get; set; }
        public object Select { get; internal set; }

        public DbSet<TextArea> TextAreas { get; set; }
        public object TextArea { get; internal set; }

        public DbSet<Option> Options { get; set; }
        public object Option { get; internal set; }

        // LIST / NAVIGATION
        public DbSet<ListItem> ListItems { get; set; }
        public object ListItem { get; internal set; }

        public DbSet<List> Lists { get; set; }
        public object List { get; internal set; }

        public DbSet<MenuList> MenuLists { get; set; }
        public object MenuList { get; internal set; }

        public DbSet<INDEX> Indexes { get; set; }
        public object Index { get; internal set; }

        public DbSet<IMAGEGALLERY> ImageGalleries { get; set; }
        public object ImageGallery { get; internal set; }

        public DbSet<INDEXMAIN> IndexMains { get; set; }
        public object IndexMain { get; internal set; }

        public DbSet<CHAT> Chats { get; set; }
        public object Chat { get; internal set; }

        public DbSet<JUMBOTRON> Jumbotrons { get; set; }
        public object Jumbotron { get; internal set; }

        public DbSet<PARAGRAPH> Paragraphs { get; set; }
        public object Paragraph { get; internal set; }

        public DbSet<BANNER> Banners { get; set; }
        public object Banner { get; internal set; }

        public DbSet<CALLOUT> Callouts { get; set; }
        public object Callout { get; internal set; }

        public DbSet<THUMBNAIL> Thumbnails { get; set; }
        public object Thumbnail { get; internal set; }

        public DbSet<TEXTBLOCK> TextBlocks { get; set; }
        public object TextBlock { get; internal set; }

        public DbSet<NavItem> NavItems { get; set; }
        public object NavItem { get; internal set; }

        // OTHER
        public DbSet<FormPost> FormPosts { get; set; }
        public object FormPost { get; internal set; }
        
        public DbSet<Procedure> Procedures { get; set; }
        public object Procedure { get; internal set; }

        public DbSet<Report> Reports { get; set; }
        public object Report { get; internal set; }

        // DICTIONARY
        public DbSet<DICTIONARY> Dictionaries { get; set; }
        public object Dictionary { get; internal set; }

        //public DbSet<SENTENCE> Sentences { get; set; }
        //public object Sentence { get; internal set; }

        public DbSet<WORD> Words { get; set; }
        public object Word { get; internal set; }

        //public DbSet<Param> Params { get; set; }
        //public object Param { get; internal set; }

        public DbSet<Log> Logs { get; set; }
        public object Log { get; internal set; }        

        /// <summary>
        /// Construct the Object Database Context
        /// </summary>
        public ObjectDBContext() : base("DefaultConnection") {
            this.dbSets = new Dictionary<string, DbSet>();
            this.dbSets.Add("Main", Mains);
            this.dbSets.Add("Container", Containers);
            this.dbSets.Add("CLASSVIEWER", ClassViewers);
            this.dbSets.Add("CHAT", Chats);
            this.dbSets.Add("IFrame", IFrames);
            this.dbSets.Add("ARTICLE", Articles);
            this.dbSets.Add("SECTION", Sections);
            this.dbSets.Add("Form", Forms);
            this.dbSets.Add("FieldSet", FieldSets);
            this.dbSets.Add("FormElementGroup", FormElementGroups);
            this.dbSets.Add("FormElement", FormElements);
            this.dbSets.Add("Input", Inputs);
            this.dbSets.Add("Select", Selects);
            this.dbSets.Add("TextArea", TextAreas);
            this.dbSets.Add("Option", Options);
            this.dbSets.Add("ListItem", ListItems);
            this.dbSets.Add("List", Lists);
            this.dbSets.Add("MenuList", MenuLists);
            this.dbSets.Add("IMAGEGALLERY", ImageGalleries);
            this.dbSets.Add("Index", Indexes);
            this.dbSets.Add("IndexMain", IndexMains);
            this.dbSets.Add("Jumbotron", Jumbotrons);
            this.dbSets.Add("Banner", Banners);
            this.dbSets.Add("Paragraph", Paragraphs);
            this.dbSets.Add("Callout", Callouts);
            this.dbSets.Add("Thumbnail", Thumbnails);
            this.dbSets.Add("TextBlock", TextBlocks);
            this.dbSets.Add("NavItem", NavItems);
            this.dbSets.Add("FormPost", FormPosts);
            this.dbSets.Add("Procedure", Procedures);
            this.dbSets.Add("Report", Reports);
            //this.dbSets.Add("Param", Params);
            this.dbSets.Add("DICTIONARY", Dictionaries);
            //this.dbSets.Add("SENTENCE", Sentences);
            this.dbSets.Add("WORD", Words);
            this.dbSets.Add("Log", Logs);
        }
    }
}
namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "ICARUS.Apps",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        subsections = c.String(nullable: false),
                        state = c.Int(nullable: false),
                        element = c.String(nullable: false, maxLength: 64),
                        authorId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "ICARUS.Containers",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        subsections = c.String(nullable: false),
                        state = c.Int(nullable: false),
                        element = c.String(nullable: false, maxLength: 64),
                        authorId = c.String(nullable: false, maxLength: 128),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "ICARUS.FormCategories",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        authorId = c.String(nullable: false, maxLength: 128),
                        label = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "ICARUS.FormElementOptions",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        parentId = c.Int(nullable: false),
                        childGroupId = c.Int(nullable: false),
                        categoryId = c.Int(nullable: false),
                        typeId = c.Int(nullable: false),
                        label = c.String(nullable: false, maxLength: 128),
                        value = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "ICARUS.FormElements",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tagId = c.Int(nullable: false),
                        typeId = c.Int(nullable: false),
                        categoryId = c.Int(nullable: false),
                        authorId = c.String(nullable: false, maxLength: 128),
                        name = c.String(nullable: false, maxLength: 128),
                        label = c.String(nullable: false, maxLength: 128),
                        options = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "ICARUS.FormPosts",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        formId = c.Int(nullable: false),
                        timestamp = c.String(),
                        version = c.Double(nullable: false),
                        authorId = c.String(nullable: false, maxLength: 128),
                        xmlResults = c.String(nullable: false, storeType: "xml"),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "ICARUS.FormValues",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        name = c.String(nullable: false, maxLength: 128),
                        type = c.String(nullable: false, maxLength: 128),
                        value = c.String(nullable: false, maxLength: 128),
                        FormPost_id = c.Int(),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("ICARUS.FormPosts", t => t.FormPost_id)
                .Index(t => t.FormPost_id);
            
            CreateTable(
                "ICARUS.Logs",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        dateCreated = c.DateTime(nullable: false),
                        authorId = c.String(nullable: false, maxLength: 128),
                        data = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "ICARUS.Params",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        type = c.Int(nullable: false),
                        name = c.String(nullable: false, maxLength: 128),
                        value = c.String(maxLength: 128),
                        procedureId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "ICARUS.Procedures",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        authorId = c.String(nullable: false, maxLength: 128),
                        label = c.String(nullable: false, maxLength: 128),
                        typeId = c.Int(nullable: false),
                        description = c.String(maxLength: 512),
                        name = c.String(nullable: false, maxLength: 128),
                        columns = c.String(nullable: false, maxLength: 512),
                        parameters = c.String(nullable: false, maxLength: 512),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "ICARUS.Reports",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        authorId = c.String(nullable: false, maxLength: 128),
                        name = c.String(nullable: false),
                        title = c.String(nullable: false, maxLength: 128),
                        description = c.String(nullable: false),
                        reportSourceId = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("ICARUS.FormValues", "FormPost_id", "ICARUS.FormPosts");
            DropIndex("ICARUS.FormValues", new[] { "FormPost_id" });
            DropTable("ICARUS.Reports");
            DropTable("ICARUS.Procedures");
            DropTable("ICARUS.Params");
            DropTable("ICARUS.Logs");
            DropTable("ICARUS.FormValues");
            DropTable("ICARUS.FormPosts");
            DropTable("ICARUS.FormElements");
            DropTable("ICARUS.FormElementOptions");
            DropTable("ICARUS.FormCategories");
            DropTable("ICARUS.Containers");
            DropTable("ICARUS.Apps");
        }
    }
}

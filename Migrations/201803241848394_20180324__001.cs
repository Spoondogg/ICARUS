namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180324__001 : DbMigration
    {
        public override void Up()
        {
            DropTable("ICARUS.FormElementOptions");
            DropTable("ICARUS.FormElements");
        }
        
        public override void Down()
        {
            CreateTable(
                "ICARUS.FormElements",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tagId = c.Int(nullable: false),
                        typeId = c.Int(nullable: false),
                        categoryId = c.Int(nullable: false),
                        name = c.String(nullable: false, maxLength: 128),
                        options = c.String(nullable: false),
                        element = c.String(nullable: false, maxLength: 64),
                        authorId = c.String(nullable: false, maxLength: 128),
                        status = c.Int(nullable: false),
                        subsections = c.String(nullable: false),
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
                        element = c.String(nullable: false, maxLength: 64),
                        authorId = c.String(nullable: false, maxLength: 128),
                        status = c.Int(nullable: false),
                        subsections = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
        }
    }
}

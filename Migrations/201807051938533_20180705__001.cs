namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180705__001 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "ICARUS.DICTIONARies",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        label = c.String(nullable: false, maxLength: 128),
                        description = c.String(nullable: false, maxLength: 512),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "ICARUS.WORDs",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        typeId = c.Int(nullable: false),
                        syllableCount = c.Int(nullable: false),
                        value = c.String(nullable: false, maxLength: 128),
                        definition = c.String(nullable: false),
                        xmlResults = c.String(nullable: false, storeType: "xml"),
                        DICTIONARY_id = c.Int(),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("ICARUS.DICTIONARies", t => t.DICTIONARY_id)
                .Index(t => t.DICTIONARY_id);
            
            CreateTable(
                "ICARUS.SENTENCEs",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        typeId = c.Int(nullable: false),
                        wordCount = c.Int(nullable: false),
                        value = c.String(nullable: false, maxLength: 128),
                        subjects = c.String(nullable: false),
                        Capacity = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("ICARUS.WORDs", "DICTIONARY_id", "ICARUS.DICTIONARies");
            DropIndex("ICARUS.WORDs", new[] { "DICTIONARY_id" });
            DropTable("ICARUS.SENTENCEs");
            DropTable("ICARUS.WORDs");
            DropTable("ICARUS.DICTIONARies");
        }
    }
}

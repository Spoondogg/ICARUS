namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180705__003 : DbMigration
    {
        public override void Up()
        {
            DropIndex("ICARUS.WORDs", new[] { "DICTIONARY_id" });
            AddColumn("ICARUS.Containers", "DICTIONARY_id", c => c.Int());
            CreateIndex("ICARUS.Containers", "DICTIONARY_id");
            DropTable("ICARUS.WORDs");
        }
        
        public override void Down()
        {
            CreateTable(
                "ICARUS.WORDs",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        status = c.Int(nullable: false),
                        typeId = c.Int(nullable: false),
                        syllableCount = c.Int(nullable: false),
                        value = c.String(nullable: false, maxLength: 128),
                        definition = c.String(nullable: false),
                        xmlResults = c.String(nullable: false, storeType: "xml"),
                        DICTIONARY_id = c.Int(),
                    })
                .PrimaryKey(t => t.id);
            
            DropIndex("ICARUS.Containers", new[] { "DICTIONARY_id" });
            DropColumn("ICARUS.Containers", "DICTIONARY_id");
            CreateIndex("ICARUS.WORDs", "DICTIONARY_id");
        }
    }
}

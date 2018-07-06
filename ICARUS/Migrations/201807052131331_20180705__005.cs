namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180705__005 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("ICARUS.Containers", "DICTIONARY_id", "ICARUS.DICTIONARies");
            DropIndex("ICARUS.Containers", new[] { "DICTIONARY_id" });
            DropColumn("ICARUS.Containers", "DICTIONARY_id");
            DropTable("ICARUS.DICTIONARies");
            DropTable("ICARUS.SENTENCEs");
        }
        
        public override void Down()
        {
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
            
            CreateTable(
                "ICARUS.DICTIONARies",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        label = c.String(),
                        description = c.String(),
                    })
                .PrimaryKey(t => t.id);
            
            AddColumn("ICARUS.Containers", "DICTIONARY_id", c => c.Int());
            CreateIndex("ICARUS.Containers", "DICTIONARY_id");
            AddForeignKey("ICARUS.Containers", "DICTIONARY_id", "ICARUS.DICTIONARies", "id");
        }
    }
}

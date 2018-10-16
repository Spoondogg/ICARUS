namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180705_006 : DbMigration
    {
        public override void Up()
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
            
        }
        
        public override void Down()
        {
            DropTable("ICARUS.SENTENCEs");
        }
    }
}

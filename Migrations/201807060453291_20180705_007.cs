namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180705_007 : DbMigration
    {
        public override void Up()
        {
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
            
        }
    }
}

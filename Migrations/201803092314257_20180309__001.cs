namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180309__001 : DbMigration
    {
        public override void Up()
        {
            DropTable("ICARUS.Mains");
        }
        
        public override void Down()
        {
            CreateTable(
                "ICARUS.Mains",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        label = c.String(nullable: false, maxLength: 128),
                        element = c.String(nullable: false, maxLength: 64),
                        authorId = c.String(nullable: false, maxLength: 128),
                        status = c.Int(nullable: false),
                        subsections = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
        }
    }
}

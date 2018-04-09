namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180408__001 : DbMigration
    {
        public override void Up()
        {
            DropTable("ICARUS.FormCategories");
        }
        
        public override void Down()
        {
            CreateTable(
                "ICARUS.FormCategories",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        authorId = c.String(nullable: false, maxLength: 128),
                        label = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.id);
            
        }
    }
}

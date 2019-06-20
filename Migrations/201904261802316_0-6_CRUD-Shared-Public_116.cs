namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _06_CRUDSharedPublic_116 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Containers", "isPublic", c => c.Int(nullable: false));
            AddColumn("ICARUS.FormPosts", "isPublic", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.FormPosts", "isPublic");
            DropColumn("ICARUS.Containers", "isPublic");
        }
    }
}

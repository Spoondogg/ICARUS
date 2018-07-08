namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180707_001 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.FormPosts", "status", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.FormPosts", "status");
        }
    }
}

namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180504__001 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.FormPosts", "shared", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.FormPosts", "shared");
        }
    }
}

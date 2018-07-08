namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180708_003 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.FormPosts", "dateCreated", c => c.DateTime(nullable: false));
            DropColumn("ICARUS.FormPosts", "timestamp");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.FormPosts", "timestamp", c => c.DateTime(nullable: false));
            DropColumn("ICARUS.FormPosts", "dateCreated");
        }
    }
}

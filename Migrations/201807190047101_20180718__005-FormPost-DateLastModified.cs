namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180718__005FormPostDateLastModified : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.FormPosts", "dateLastModified", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.FormPosts", "dateLastModified");
        }
    }
}

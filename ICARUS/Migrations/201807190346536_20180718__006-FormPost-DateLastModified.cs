namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180718__006FormPostDateLastModified : DbMigration
    {
        public override void Up()
        {
            DropColumn("ICARUS.FormPosts", "label");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.FormPosts", "label", c => c.String(nullable: false, maxLength: 128));
        }
    }
}

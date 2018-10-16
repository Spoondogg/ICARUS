namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180420__006 : DbMigration
    {
        public override void Up()
        {
            DropColumn("ICARUS.FormPosts", "jsonResults");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.FormPosts", "jsonResults", c => c.String(nullable: false, maxLength: 4000));
        }
    }
}

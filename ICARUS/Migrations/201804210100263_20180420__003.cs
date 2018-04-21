namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180420__003 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.FormPosts", "jsonResults", c => c.String(nullable: false, maxLength: 4000));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.FormPosts", "jsonResults");
        }
    }
}

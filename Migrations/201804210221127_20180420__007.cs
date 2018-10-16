namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180420__007 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.FormPosts", "jsonResults", c => c.String(maxLength: 4000));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.FormPosts", "jsonResults");
        }
    }
}

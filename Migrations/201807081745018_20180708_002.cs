namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180708_002 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("ICARUS.FormPosts", "timestamp", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("ICARUS.FormPosts", "timestamp", c => c.String());
        }
    }
}

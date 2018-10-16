namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180420__008 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("ICARUS.FormPosts", "jsonResults", c => c.String(nullable: false, maxLength: 4000));
        }
        
        public override void Down()
        {
            AlterColumn("ICARUS.FormPosts", "jsonResults", c => c.String(maxLength: 4000));
        }
    }
}

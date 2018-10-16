namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180310__003 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("ICARUS.Containers", "dateLastModified", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("ICARUS.Containers", "dateLastModified", c => c.DateTime(nullable: false));
        }
    }
}

namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180310__002 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("ICARUS.Containers", "dateCreated", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("ICARUS.Containers", "dateCreated", c => c.DateTime(nullable: false));
        }
    }
}

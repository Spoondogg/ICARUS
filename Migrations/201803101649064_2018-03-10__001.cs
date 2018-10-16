namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180310__001 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Containers", "dateCreated", c => c.DateTime(nullable: false));
            AddColumn("ICARUS.Containers", "dateLastModified", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.Containers", "dateLastModified");
            DropColumn("ICARUS.Containers", "dateCreated");
        }
    }
}

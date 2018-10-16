namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180215__001 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.FormElementOptions", "status", c => c.Int(nullable: false));
            AddColumn("ICARUS.FormElements", "status", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.FormElements", "status");
            DropColumn("ICARUS.FormElementOptions", "status");
        }
    }
}

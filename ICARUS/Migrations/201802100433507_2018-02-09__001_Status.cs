namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180209__001_Status : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Apps", "status", c => c.Int(nullable: false));
            AddColumn("ICARUS.Containers", "status", c => c.Int(nullable: false));
            DropColumn("ICARUS.Apps", "state");
            DropColumn("ICARUS.Containers", "state");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.Containers", "state", c => c.Int(nullable: false));
            AddColumn("ICARUS.Apps", "state", c => c.Int(nullable: false));
            DropColumn("ICARUS.Containers", "status");
            DropColumn("ICARUS.Apps", "status");
        }
    }
}

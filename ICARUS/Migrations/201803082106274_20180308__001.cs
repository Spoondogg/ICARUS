namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180308__001 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Containers", "expand", c => c.Boolean());
            AddColumn("ICARUS.Containers", "showHeader", c => c.Boolean());
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.Containers", "showHeader");
            DropColumn("ICARUS.Containers", "expand");
        }
    }
}

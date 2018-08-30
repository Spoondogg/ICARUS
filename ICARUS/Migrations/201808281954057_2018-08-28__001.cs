namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180828__001 : DbMigration
    {
        public override void Up()
        {
            DropColumn("ICARUS.Containers", "showHeader");
            DropColumn("ICARUS.Containers", "hasTab");
            DropColumn("ICARUS.Containers", "hasSidebar");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.Containers", "hasSidebar", c => c.Int(nullable: false));
            AddColumn("ICARUS.Containers", "hasTab", c => c.Int(nullable: false));
            AddColumn("ICARUS.Containers", "showHeader", c => c.Int(nullable: false));
        }
    }
}

namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180420__001 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Containers", "attributesId", c => c.Int(nullable: false));
            DropColumn("ICARUS.Containers", "formPostId");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.Containers", "formPostId", c => c.Int(nullable: false));
            DropColumn("ICARUS.Containers", "attributesId");
        }
    }
}

namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180425__001 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Containers", "dataId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.Containers", "dataId");
        }
    }
}

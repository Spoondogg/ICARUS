namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180502__001 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Containers", "shared", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.Containers", "shared");
        }
    }
}

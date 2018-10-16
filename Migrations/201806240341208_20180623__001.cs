namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180623__001 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Containers", "descriptionId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.Containers", "descriptionId");
        }
    }
}

namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180309__003 : DbMigration
    {
        public override void Up()
        {
            DropColumn("ICARUS.Containers", "expand");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.Containers", "expand", c => c.Boolean());
        }
    }
}

namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180705__002 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.WORDs", "status", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.WORDs", "status");
        }
    }
}

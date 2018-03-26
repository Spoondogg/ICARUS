namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180222__001 : DbMigration
    {
        public override void Up()
        {
            DropColumn("ICARUS.Apps", "label");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.Apps", "label", c => c.String(nullable: false, maxLength: 128));
        }
    }
}

namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180222__004 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Apps", "label", c => c.String(nullable: false, maxLength: 128));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.Apps", "label");
        }
    }
}

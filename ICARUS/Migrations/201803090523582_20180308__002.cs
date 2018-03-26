namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180308__002 : DbMigration
    {
        public override void Up()
        {
            DropColumn("ICARUS.Apps", "brand");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.Apps", "brand", c => c.String(nullable: false, maxLength: 128));
        }
    }
}

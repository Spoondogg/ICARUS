namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180123_001_AppLabel : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Apps", "label", c => c.String(nullable: false, maxLength: 128));
            AddColumn("ICARUS.Apps", "brand", c => c.String(nullable: false, maxLength: 128));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.Apps", "brand");
            DropColumn("ICARUS.Apps", "label");
        }
    }
}

namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180130_001__EL : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.FormElementOptions", "element", c => c.String(nullable: false, maxLength: 64));
            AddColumn("ICARUS.FormElements", "element", c => c.String(nullable: false, maxLength: 64));
            DropColumn("ICARUS.Apps", "authorId");
            DropColumn("ICARUS.Containers", "authorId");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.Containers", "authorId", c => c.String(nullable: false, maxLength: 128));
            AddColumn("ICARUS.Apps", "authorId", c => c.String(nullable: false, maxLength: 128));
            DropColumn("ICARUS.FormElements", "element");
            DropColumn("ICARUS.FormElementOptions", "element");
        }
    }
}

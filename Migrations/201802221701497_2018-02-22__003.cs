namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180222__003 : DbMigration
    {
        public override void Up()
        {
            DropColumn("ICARUS.Apps", "innerHtml");
            DropColumn("ICARUS.Containers", "innerHtml");
            DropColumn("ICARUS.FormElementOptions", "innerHtml");
            DropColumn("ICARUS.FormElements", "innerHtml");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.FormElements", "innerHtml", c => c.String());
            AddColumn("ICARUS.FormElementOptions", "innerHtml", c => c.String());
            AddColumn("ICARUS.Containers", "innerHtml", c => c.String());
            AddColumn("ICARUS.Apps", "innerHtml", c => c.String());
        }
    }
}

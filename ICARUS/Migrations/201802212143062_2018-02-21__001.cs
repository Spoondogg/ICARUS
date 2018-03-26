namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180221__001 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Apps", "innerHtml", c => c.String());
            AddColumn("ICARUS.Containers", "innerHtml", c => c.String());
            AddColumn("ICARUS.FormElementOptions", "innerHtml", c => c.String());
            AddColumn("ICARUS.FormElements", "innerHtml", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.FormElements", "innerHtml");
            DropColumn("ICARUS.FormElementOptions", "innerHtml");
            DropColumn("ICARUS.Containers", "innerHtml");
            DropColumn("ICARUS.Apps", "innerHtml");
        }
    }
}

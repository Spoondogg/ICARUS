namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180214__001 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.FormElementOptions", "subsections", c => c.String(nullable: false));
            AddColumn("ICARUS.FormElements", "subsections", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.FormElements", "subsections");
            DropColumn("ICARUS.FormElementOptions", "subsections");
        }
    }
}

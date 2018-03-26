namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180130_002__EL : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Apps", "authorId", c => c.String(nullable: false, maxLength: 128));
            AddColumn("ICARUS.Containers", "authorId", c => c.String(nullable: false, maxLength: 128));
            AddColumn("ICARUS.FormElementOptions", "authorId", c => c.String(nullable: false, maxLength: 128));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.FormElementOptions", "authorId");
            DropColumn("ICARUS.Containers", "authorId");
            DropColumn("ICARUS.Apps", "authorId");
        }
    }
}

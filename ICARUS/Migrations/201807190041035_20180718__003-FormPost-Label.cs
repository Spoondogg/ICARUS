namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180718__003FormPostLabel : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.FormPosts", "label", c => c.String());
            DropColumn("ICARUS.FormPosts", "version");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.FormPosts", "version", c => c.Double(nullable: false));
            DropColumn("ICARUS.FormPosts", "label");
        }
    }
}

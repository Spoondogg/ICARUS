namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180718__004FormPostLabel : DbMigration
    {
        public override void Up()
        {
            AlterColumn("ICARUS.FormPosts", "label", c => c.String(nullable: false, maxLength: 128));
        }
        
        public override void Down()
        {
            AlterColumn("ICARUS.FormPosts", "label", c => c.String());
        }
    }
}

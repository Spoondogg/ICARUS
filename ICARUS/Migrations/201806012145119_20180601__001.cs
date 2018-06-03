namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180601__001 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("ICARUS.FormPosts", "jsonResults", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("ICARUS.FormPosts", "jsonResults", c => c.String(maxLength: 4000));
        }
    }
}

namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20190624__Tags : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Containers", "tags", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("ICARUS.Containers", "tags");
        }
    }
}

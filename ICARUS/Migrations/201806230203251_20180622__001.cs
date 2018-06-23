namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180622__001 : DbMigration
    {
        public override void Up()
        {
            DropColumn("ICARUS.Procedures", "columns");
            DropColumn("ICARUS.Procedures", "parameters");
            DropTable("ICARUS.Params");
        }
        
        public override void Down()
        {
            CreateTable(
                "ICARUS.Params",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        type = c.Int(nullable: false),
                        name = c.String(nullable: false, maxLength: 128),
                        value = c.String(maxLength: 128),
                        procedureId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            AddColumn("ICARUS.Procedures", "parameters", c => c.String(nullable: false, maxLength: 512));
            AddColumn("ICARUS.Procedures", "columns", c => c.String(nullable: false, maxLength: 512));
        }
    }
}

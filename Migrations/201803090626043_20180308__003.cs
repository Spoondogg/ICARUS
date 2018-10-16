namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180308__003 : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "ICARUS.Apps", newName: "Mains");
        }
        
        public override void Down()
        {
            RenameTable(name: "ICARUS.Mains", newName: "Apps");
        }
    }
}

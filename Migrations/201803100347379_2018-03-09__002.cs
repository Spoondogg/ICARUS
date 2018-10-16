namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180309__002 : DbMigration
    {
        public override void Up()
        {
            AddColumn("ICARUS.Containers", "label", c => c.String(nullable: false, maxLength: 128));
            AddColumn("ICARUS.Containers", "collapsed", c => c.Int(nullable: false));
            AddColumn("ICARUS.Containers", "hasTab", c => c.Int(nullable: false));
            AlterColumn("ICARUS.Containers", "showHeader", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("ICARUS.Containers", "showHeader", c => c.Boolean());
            DropColumn("ICARUS.Containers", "hasTab");
            DropColumn("ICARUS.Containers", "collapsed");
            DropColumn("ICARUS.Containers", "label");
        }
    }
}

namespace ICARUS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _20180820__001 : DbMigration
    {
        public override void Up()
        {
            DropColumn("ICARUS.Containers", "collapsed");
        }
        
        public override void Down()
        {
            AddColumn("ICARUS.Containers", "collapsed", c => c.Int(nullable: false));
        }
    }
}

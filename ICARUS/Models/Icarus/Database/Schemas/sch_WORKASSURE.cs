using ICARUS.Models.Icarus.ColumnLists;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Schemas {

    /// <summary>
    /// A Work Assure schema based on PROD feeds
    /// </summary>
    public class sch_WORKASSURE : IcarusSchema {

        /// <summary>
        /// Constructs a generic Logging schema
        /// </summary>
        public sch_WORKASSURE() : base("WORKASSURE") {
            this.addTable(new IcarusTable("tbl_BusinessUnit", new ArrayList()));
            this.addTable(new IcarusTable("tbl_BusinessUnitBu", new ArrayList()));
            this.addTable(new IcarusTable("tbl_ChangeHistory", new ArrayList()));
            this.addTable(new IcarusTable("tbl_Customer", new ArrayList()));
            this.addTable(new IcarusTable("tbl_Detail", new ArrayList()));
            this.addTable(new IcarusTable("tbl_Equipment", new ArrayList()));
            this.addTable(new IcarusTable("tbl_Location", new ArrayList()));
            this.addTable(new IcarusTable("tbl_MFUser", new ArrayList()));
            this.addTable(new IcarusTable("tbl_ProcessingCode", new ArrayList()));
            this.addTable(new IcarusTable("tbl_RequirementList", new ArrayList()));
            this.addTable(new IcarusTable("tbl_Service", new ArrayList()));
            this.addTable(new IcarusTable("tbl_SignalMeasure", new ArrayList()));
            this.addTable(new IcarusTable("tbl_Survey", new ArrayList()));
            this.addTable(new IcarusTable("tbl_UserAcitivtyLog", new ArrayList()));
            this.addTable(new IcarusTable("tbl_UserBU", new ArrayList()));
            this.addTable(new IcarusTable("tbl_UserCategorySummary", new ArrayList()));
            this.addTable(new IcarusTable("tbl_UserSchedule", new ArrayList()));
            this.addTable(new IcarusTable("tbl_WorkOrder", new ArrayList()));
        }
    }
}
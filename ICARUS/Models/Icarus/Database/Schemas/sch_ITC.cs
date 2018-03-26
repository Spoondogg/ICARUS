using ICARUS.Models.Icarus.ColumnLists;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Schemas {

    /// <summary>
    /// An Ontario One Call (OOC) Schema
    /// </summary>
    public class sch_ITC : IcarusSchema {

        /// <summary>
        /// Constructs a generic EzCare schema
        /// </summary>
        public sch_ITC() : base("ITC") {
            this.addTable(new IcarusTable("tbl_BookingAgent", new ArrayList()));
            this.addTable(new IcarusTable("tbl_Code36", new ArrayList()));
            this.addTable(new IcarusTable("tbl_Code95", new ArrayList()));
            this.addTable(new IcarusTable("tbl_HistCust", new ArrayList()));
            this.addTable(new IcarusTable("tbl_HistCustRate", new ArrayList()));
            this.addTable(new IcarusTable("tbl_HistDispatch", new ArrayList()));
            this.addTable(new IcarusTable("tbl_HistFldSvc", new ArrayList()));
            this.addTable(new IcarusTable("tbl_HistMaster", new ArrayList()));
            this.addTable(new IcarusTable("tbl_Quota", new ArrayList()));
            this.addTable(new IcarusTable("tbl_WipOrdComms", new ArrayList()));
        }
    }
}
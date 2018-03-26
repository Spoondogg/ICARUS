/**
    Generic Report Constructor
    @param {object} node The parent element for this object
    @param {object} data The json object for this REPORT
*/
class REPORT {
    constructor(node, data) {
        node.innerHTML = "";
        this.data = data;

        this.report = new EL(node, 'DIV', new MODEL(new ATTRIBUTES('report col-sm-12')));

        //this.loader = new EL(this.report.el, 'div', {'style':'margin:100px auto;width:360px;display:block;float:none;clear:both;text-align:center;'});
        //this.loaderText = new EL(this.loader.el,'p',{},'Retrieving Records...');
        //this.loaderIcon = new EL(this.loader.el,'img',{'src':'#/static/images/ajax-loader.gif'});	

    }
	
	/**
	Populates the report with the given values
	*/
	showReportData() {		
		try {			
			setTimeout(this.createReport(), 1000);			
		} catch (e){
			console.log('Unable to create report: '+e.message);
			this.loaderText.el.innerHTML = "Unable to retrieve records.\n"+e.message;
		}
	}
	
	// Creates the Report Elements
	createReport() {
		console.log('showReportData: Generating report data...');
        let records = new Array();
        let c;
		for(let i=0; i<data.report.data.length; i++){
			
			// Create thead/tbody
			if(i===0){
				//let container = new EL(parentObj, 'div', {'class':'reportData'});
                let table = new EL(node,'TABLE', new MODEL(new ATTRIBUTES('table table-fixed table-striped')));
                let thead = new EL(table.el, 'THEAD', new MODEL(new ATTRIBUTES('thead-inverse')));
                let theadTR = new EL(thead.el,'TR');
				
                let theadArr = new Array();
				
                for(c=0; c<data.report.dataColumns.length; c++){
					theadArr.push(new EL(theadTR.el,'th',{}, data.report.dataColumns[c]));
				}				
				let tBody = new EL(table.el,'tbody');
			}
			
			// CONSTRUCT the record 
            let record = data.report.data[i];
            let recordPane = new EL(tBody.el, 'tr');
            let recordArr = new Array();
			for(c=0; c<data.report.dataColumns.length; c++){
				recordArr.push(new EL(recordPane.el,'td',{}, record.columnData[data.report.dataColumns[c]]));
			}
		}
	}
}
/**
    A chart object using Google's chart API
    @author Ryan Dunphy | spoonMEDIA.ca © 2013
    @since 2016-11-16
    @version 0.1.1

    @param {EL} node The parent node
    @param {object} data Chart data
    @param {any} type Chart type
 */
class CHART {
    constructor(node, data, type) {
        this.chart = new EL(node, 'div', { 'class': 'chart col-sm-12' }, 'ChartDiv');

        this.loader = new EL(this.chart.el, 'div', { 'style': 'margin:100px auto;width:360px;display:block;float:none;clear:both;text-align:center;' });
        this.loaderText = new EL(this.loader.el, 'p', {}, 'Retrieving Chart Details...');
        this.loaderIcon = new EL(this.loader.el, 'img', { 'src': '/icarus/static/images/ajax-loader.gif' });

        this.data = data;

        this.btnRefresh = document.getElementById('btn_refreshChart');
        this.btnRefresh.onclick = function () {

            let chart = document.getElementById('chart');

            chart.innerHTML = "";
            chart.loader = new EL(chart, 'div', { 'style': 'margin:100px auto;width:360px;display:block;float:none;clear:both;text-align:center;' });
            chart.loaderText = new EL(chart.loader.el, 'p', {}, 'Retrieving Chart Details...');
            chart.loaderIcon = new EL(chart.loader.el, 'img', { 'src': '/icarus/static/images/ajax-loader.gif' });

            let url = '/Procedures/Details/';
            let urlString = '';
            let args = this.form.elements;
            for (let i = 0; i < args.length; i++) {
                console.log(i + ": " + args[i].name.replace('@', '') + "=" + args[i].value);
                urlString += '&' + args[i].name.replace('@', '') + "=" + encodeURIComponent(args[i].value);
            }
            console.log('URL: ' + url + urlString);

            //window.open(url+urlString,'_blank');

            // Populate the report and chart from a JSON data source via ajax
            $.getJSON(url + urlString, function (data) {

                console.log("Loading data into chart...");
                let chart = new CHART(document.getElementById('chart'), data, type);
                chart.showChartData(type);

                //console.log("Loading data into table...");
                //var report = new REPORT(document.getElementById('report'), data);
                //report.showReportData();

            });

            return false;
        };
    }
	
	
	
	
	// Loads chart data into container
    showChartData(type) {
        google.charts.load('current', { packages: ['line', 'corechart'] });
        google.charts.setOnLoadCallback(function () {
            //this.chartBox = new EL(parentObj, 'div', {'id':'chartBox'});	
            //this.loader = new EL(this.chart.el, 'p', {'class':'loader'},'Loading Chart...');	

            this.data = new google.visualization.DataTable();
            this.options = {};

            var c;

            this.drawChart = function () {
                // The first column is the record key
                for (c = 0; c < data.report.chartColumns.length; c++) {
                    if (c === 0) {
                        this.data.addColumn('string', data.report.chartColumns[c]);
                    } else {
                        this.data.addColumn('number', data.report.chartColumns[c]);
                    }
                }

                let rows = [];
                for (let r = 0; r < data.report.chartData.length; r++) {
                    let row = [];
                    for (c = 0; c < data.report.chartColumns.length; c++) {
                        let col = null;
                        if (c === 0) {
                            col = data.report.chartData[r].columnData[data.report.chartColumns[c]];
                        } else {
                            col = parseFloat(data.report.chartData[r].columnData[data.report.chartColumns[c]]);
                        }
                        row.push(col);
                    }
                    rows.push(row);
                }
                this.data.addRows(rows);
                console.log('Chart populated');

                // Chart Options
                let colCount = data.report.chartColumns.length;

                // Instantiate the chart.
                let chartDiv;
                switch (type) {
                    case 'StackedColumn': {
                        this.options = {
                            //title: 'Sample Chart',
                            legend: {
                                position: 'right',
                                textStyle: {
                                    fontSize: 10
                                }
                            },
                            hAxis: {
                                //title: 'Fiscal Year'
                                textStyle: {
                                    fontSize: 10
                                }
                            },
                            vAxis: {
                                //title: 'Volume',
                                //subtitle: 'Sub'
                                textStyle: {
                                    fontSize: 10
                                }
                            },
                            isStacked: true,
                            seriesType: 'bars'
                        };

                        chartDiv = new google.visualization.ColumnChart(node);
                        break;
                    }
                    case 'Combo': {
                        this.options = {
                            //title: 'Sample Chart',
                            legend: {
                                position: 'right',
                                textStyle: {
                                    fontSize: 10
                                }
                            },
                            hAxis: {
                                //title: 'Fiscal Year'
                                textStyle: {
                                    fontSize: 10
                                }
                            },
                            vAxis: {
                                //title: 'Volume',
                                //subtitle: 'Sub'
                                textStyle: {
                                    fontSize: 10
                                }
                            },
                            isStacked: true,
                            seriesType: 'bars',
                            series: {
                                0: { type: 'line' }
                            }
                        };

                        chartDiv = new google.visualization.ComboChart(node);
                        break;
                    }
                    case 'Chart':
                    default: {

                        this.options = {
                            //title: 'Sample Chart',
                            legend: {
                                position: 'right',
                                textStyle: {
                                    fontSize: 10
                                }
                            },
                            hAxis: {
                                //title: 'Fiscal Year'
                                textStyle: {
                                    fontSize: 10
                                }
                            },
                            vAxis: {
                                //title: 'Volume',
                                //subtitle: 'Sub'
                                textStyle: {
                                    fontSize: 10
                                }
                            },
                            seriesType: 'line'
                        };

                        chartDiv = new google.visualization.LineChart(node);
                        break;
                    }
                }

                // Draw the chart
                chartDiv.draw(this.data, this.options);

            }.bind(this);

            // Draw the chart
            this.drawChart();

        });
    }
}
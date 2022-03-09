import React from 'react';
import ReactDOM from 'react-dom';
import FcdrrTool from './FcdrrTool'
import { FetchFcdrrSubmissions, DeleteFcdrrSubmissions, GetAllFcdrrSettings, exportToExcel, getFcdrrReportingRates, FetchFcdrrReports, FetchCounties, getAllCommodities } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class FcdrrSummaryDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allReports: [],
            loading: false,
            reportingRates: [],
            counties: [],
            commodities: [],
            reportsQuery: {
                county_name: null,
                county_id: null,
                date: new Date().toISOString().substr(0, 7),
                lab: null,
                commodity: 1
            },
            stockStatusSummary: {
                total_comsumption: 0,
                total_losses: 0,
                current_stock: 0,
            },
            accountabilitySummary: {
                negative_adjustments: 0,
                positive_adjustments: 0,
            },
            expiriesAnalysis: {
                losses: 0,
                opening: 0,
                closing: 0,
                used: 0,
            },
            status: null,
            message: null,
        }
        this.fetchAllReports = this.fetchAllReports.bind(this);
        this.fetchAllCommodities = this.fetchAllCommodities.bind(this);
        this.fetchReportingRates = this.fetchReportingRates.bind(this);
        this.getMonths = this.getMonths.bind(this);
        this.formatPeriod = this.formatPeriod.bind(this);

    }

    getMonths(noOfMonths) {
        //format = 'YYYYMM
        let months = [];
        let currentMonth = new Date().getMonth() + 1;
        let currentYear = new Date().getFullYear();
        for (let i = 0; i < noOfMonths; i++) {
            if (currentMonth < 10) {
                months.push(currentYear + '-0' + currentMonth);
            } else {
                months.push(currentYear + '-' + currentMonth);
            }
            currentMonth--;
            if (currentMonth == 0) {
                currentMonth = 12;
                currentYear--;
            }
        }
        return months;
    }

    formatPeriod(period) {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (period.length == 6 && !isNaN(period)) {
            return months[period.substr(4, 2) - 1] + ' ' + period.substr(0, 4)
        } else if (period.length == 7 && period.includes('-')) {
            let prd = period.split('-');
            return months[prd[1] - 1] + ' ' + prd[0]
        }
    }

    fetchReportingRates(qry) {
        (async () => {
            this.setState({
                loading: true
            });
            getFcdrrReportingRates(qry).then(res => {
                if ( res && res.data && res.data.Message ){
                    this.setState({
                        loading: false,
                        status: 'danger',
                        message: 'An error occured while fetching reporting rates. ' + res?.data.Message || res?.status + ' ' + res?.statusText || ''
                    })
                }else{
                    this.setState({
                        reportingRates: res,
                        loading: false,
                        status: null,
                        message: null
                    })
                }
            })
        })();
    }

    fetchAllReports(query) {
        (async () => {
            this.setState({
                loading: true
            })
            FetchFcdrrReports(query).then(res => {
                //if type = object, convert to array
                if ( res && res.data && res.data.Message ){
                    this.setState({
                        loading: false,
                        status: 'danger',
                        message: 'An error occured while fetching reports. ' + res?.data.Message || res?.status + ' ' + res?.statusText || ''
                    })
                }else{
                    let rps
                    if (Array.isArray(res)) {
                        rps = res
                    } else if (typeof res === 'object' && res.length == undefined) {
                        rps = Array.from(Object.keys(res), (key) => res[key])
                    } else {
                        rps = [];
                    }
                    let stockStatusSummary = {
                        total_comsumption: 0,
                        total_losses: 0,
                        current_stock: 0,
                    }
                    let accountabilitySummary = {
                        negative_adjustments: 0,
                        positive_adjustments: 0,
                    }
                    let expiriesAnalysis = {
                        losses: 0,
                        opening: 0,
                        closing: 0,
                        used: 0,
                    }
                    rps.forEach(report => {
                        stockStatusSummary.total_comsumption += (
                            report.qnty_used + report.adjustments_negative
                        )
                        stockStatusSummary.total_losses += (
                            report.losses_damages
                        );
                        stockStatusSummary.current_stock += report.end_of_month_stock;
                        accountabilitySummary.negative_adjustments += (
                            report.adjustments_negative + report.qnty_used + report.losses_damages + report.beggining_balance
                        );
                        accountabilitySummary.positive_adjustments += (
                            report.adjustments_positive + report.end_of_month_stock + report.qnty_received_kemsa
                        )

                        expiriesAnalysis.losses += report.losses_damages;
                        expiriesAnalysis.opening += report.beggining_balance;
                        expiriesAnalysis.closing += report.end_of_month_stock;
                        expiriesAnalysis.used += report.qnty_used;
                    })
                    this.setState({
                        stockStatusSummary: stockStatusSummary,
                        accountabilitySummary: accountabilitySummary,
                        expiriesAnalysis: expiriesAnalysis,
                        loading: false,
                        allReports: rps,
                        status: null,
                        message: null
                    })
                }
            })

        })();
    }

    fetchAllCommodities() {
        (async () => {
            getAllCommodities().then(al_c => {
                if (al_c.status == 200) {
                    this.setState({
                        commodities: al_c.data
                    });
                }
            })
        })();
    }

    componentDidMount() {
        this.fetchReportingRates(this.state.reportsQuery);
        this.fetchAllReports(this.state.reportsQuery);
        this.fetchAllCommodities();
        (async () => {
            let counties = await FetchCounties();
            this.setState({
                counties: counties
            });
        })();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            ((prevState.isSubmitResult != this.state.isSubmitResult))
        ) {

            this.fetchSubmissions();
        }
    }
    render() {

        let dashboardHeader = <div key={1} style={{ "marginBottom": "24px" }} className="row">
            <div className="col-sm-6">
                <h5 className="m-0 text-sm text-muted text-uppercase text-bold">Facility Consumption Data Report & Requisition for ASANTE</h5>
            </div>
            <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item"><a href="/dashboard">RTRI QC</a></li>
                    <li className="breadcrumb-item active">FCDRR Summary Dashboard</li>
                </ol>
            </div>
            {this.state.status && this.state.message && <div className='col-md-12'>
                <div className={`alert alert-default-${this.state.status}`}>
                    {this.state.statusCode ? <h3>{this.state.statusCode}</h3> : null}
                    {this.state.message ? <small>{this.state.message}</small> : null}
                </div>
            </div>}
        </div>

        let dashboardMain = <>
            <div key={2} className="row">
                <div className="col-sm-12 mb-5 py-1" style={{ borderBottom: '1px solid #f6f2f4' }}>
                    <div className='row'>
                        <div className='col-md-3'>
                            <h4 className="float-left text-bold">
                                <span>FCDRR Summary</span>
                            </h4>
                        </div>
                        <div className='col-md-3'>
                            <h5 className="float-left text-bold">
                                <small style={{backgroundColor: '#e4f0f5', padding: '1px 2px', border: '1px solid #d8d8fa', borderRadius:'4px', whiteSpace: 'nowrap', fontSize: '13px'}}>{this.state.reportsQuery.date ? this.formatPeriod(this.state.reportsQuery.date) : null}</small>
                                &nbsp; &nbsp; &nbsp;
                                <small style={{backgroundColor: '#e4f0f5', padding: '1px 2px', border: '1px solid #d8d8fa', borderRadius:'4px', whiteSpace: 'nowrap', fontSize: '13px'}}>{this.state.reportsQuery.county_name ? this.state.reportsQuery.county_name : this.state.reportsQuery.county_id ? this.state.counties.find(ct => ct.id == this.state.reportsQuery.county_id)?.name : 'National (Kenya)'}</small>
                                &nbsp; &nbsp; &nbsp;
                                <small style={{backgroundColor: '#e4f0f5', padding: '1px 2px', border: '1px solid #d8d8fa', borderRadius:'4px', whiteSpace: 'nowrap', fontSize: '13px'}}>{this.state.reportsQuery.commodity ? this.state.commodities.find(ct => ct.id == this.state.reportsQuery.commodity)?.commodity_name : null}</small>
                            </h5>
                        </div>
                        <div className='col-md-6'>
                            <div className='row'>
                                <div className='col-sm-4'>
                                    <select className='form-control' value={this.state.reportsQuery.date} style={{ padding: '2px', fontSize: '14px', color: '#228ccc', backgroundColor: '#f4f4fc', height: '33px' }} onChange={ev => {
                                        let qry = this.state.reportsQuery;
                                        if(ev.target.value != '-'){
                                            qry.commodity = ev.target.value;
                                        }else{
                                            qry.commodity = null;
                                        }
                                        this.setState({
                                            reportsQuery: qry
                                        })
                                        this.fetchReportingRates(qry);
                                        this.fetchAllReports(qry);
                                    }}>
                                        <option value={"-"} disabled>Select Commodity</option>
                                        {this.state.commodities && this.state.commodities.length>0 && this.state.commodities.map((cdt,ky) => (
                                            <option key={cdt.id+"-"+ky} value={cdt.id || "-"}>{cdt.commodity_name || "-"}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='col-sm-4'>
                                    <select className='form-control' value={this.state.reportsQuery.date} style={{ padding: '2px', fontSize: '14px', color: '#228ccc', backgroundColor: '#f4f4fc', height: '33px' }} onChange={ev => {
                                        let qry = this.state.reportsQuery;
                                        if(ev.target.value != '-'){
                                            qry.date = ev.target.value;
                                        }else{
                                            qry.date = new Date().toISOString().substr(0, 7)
                                        }
                                        this.setState({
                                            reportsQuery: qry
                                        })
                                        this.fetchReportingRates(qry);
                                        this.fetchAllReports(qry);
                                    }}>
                                        <option value={"-"} disabled>Select Period</option>
                                        {this.getMonths(12).map((month, index) => (
                                            <option key={month+"_"+index} value={month || "-"}>{this.formatPeriod(month) || "-"}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='col-sm-4'>
                                    <select className='form-control' value={this.state.reportsQuery.county_id} style={{ padding: '2px', fontSize: '14px', color: '#228ccc', backgroundColor: '#f4f4fc', height: '33px' }} onChange={ev => {
                                        let qry = this.state.reportsQuery;
                                        if(ev.target.value != '-'){
                                            qry.county_id = ev.target.value;
                                        }else{
                                            qry.county_id = null;
                                        }
                                        this.setState({
                                            reportsQuery: qry
                                        })
                                        this.fetchReportingRates(qry);
                                        this.fetchAllReports(qry);
                                    }}>
                                        <option value={"-"} disabled>Select County</option>
                                        <option value={"-"}>National (Kenya)</option>
                                        {this.state.counties && this.state.counties.length>0 && this.state.counties.map((county,ky) => {
                                            return <option key={county.id+"-"+ky} value={county.id || "-"}>{county.name || "-"}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card" style={{ backgroundColor: '#fafaf6', border: '1px solid transparent', borderRadius: '4px' }}>
                        <div className="card-header text-center">
                            <h5 className='text-bold mb-0 text-uppercase text-md'>Stock levels summary</h5>
                        </div>
                        <div className="card-body" style={{ minHeight: '400px' }}>
                            {/* <p style={{fontSize:'14px'}}>Bar chart showing stock levels for all commodities nationally.</p> */}
                            <HighchartsReact highcharts={Highcharts} options={{
                                chart: {
                                    type: 'pie'
                                },
                                title: {
                                    text: 'Stock levels summary'
                                },
                                colors: ['#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee'],
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: true,
                                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                        }
                                    }
                                },
                                series: [{
                                    name: 'Stock levels',
                                    data: [
                                        ['Current Stock', this.state.stockStatusSummary.current_stock],
                                        ['Total Consumption', this.state.stockStatusSummary.total_comsumption],
                                        ['Total Losses', this.state.stockStatusSummary.total_losses],
                                    ]
                                }],
                                credits: {
                                    enabled: false
                                },
                                exporting: {
                                    enabled: true,
                                    filename: 'Stock levels summary'
                                }
                            }} />
                            {/* <details>
                                <summary style={{ color: '#9f9f9f' }}>&nbsp;</summary>
                                <pre style={{ backgroundColor: 'aliceblue', borderRadius: '4px', padding: '5px', fontSize: '12px', border: '1px solid #dadada', maxHeight: '500px', overflowY: 'auto' }}>
                                    {JSON.stringify(this.state.stockStatusSummary, null, 2)}
                                </pre>
                            </details> */}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card" style={{ backgroundColor: '#fafaf6', border: '1px solid transparent', borderRadius: '4px' }}>
                        <div className="card-header text-center">
                            <h5 className='text-bold mb-0 text-uppercase text-md'>Accountability summary</h5>
                        </div>
                        <div className="card-body" style={{ minHeight: '400px' }}>
                            {/* <p style={{fontSize:'14px'}}>Bar chart showing stock levels for all commodities nationally.</p> */}
                            <HighchartsReact highcharts={Highcharts} options={{
                                chart: {
                                    type: 'pie'
                                },
                                title: {
                                    text: 'Accountability summary'
                                },
                                subtitle: {
                                    text: 'All Negative adjustments (losses, qty used, negative adjustments, beginning balance) vs all positive adjustments (closing balance, qty received, positive adjustments, ending balance)'
                                },
                                colors: ['#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee'],
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: true,
                                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                        }
                                    }
                                },
                                series: [{
                                    name: 'Accountability',
                                    data: [
                                        ['Negative adjustments', this.state.accountabilitySummary.negative_adjustments],
                                        ['Positive adjustments', this.state.accountabilitySummary.positive_adjustments]
                                    ]
                                }],
                                credits: {
                                    enabled: false
                                },
                                exporting: {
                                    enabled: true,
                                    filename: 'Accountability summary'
                                }
                            }} />
                            {/* <details>
                                <summary style={{ color: '#9f9f9f' }}>&nbsp;</summary>
                                <pre style={{ backgroundColor: 'aliceblue', borderRadius: '4px', padding: '5px', fontSize: '12px', border: '1px solid #dadada', maxHeight: '500px', overflowY: 'auto' }}>
                                    {JSON.stringify(this.state.accountabilitySummary, null, 2)}
                                </pre>
                            </details> */}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card" style={{ backgroundColor: '#fafaf6', border: '1px solid transparent', borderRadius: '4px' }}>
                        <div className="card-header text-center">
                            <h5 className='text-bold mb-0 text-uppercase text-md'>Reporting rate</h5>
                        </div>
                        <div className="card-body" style={{ minHeight: '400px' }}>
                            {/* <p style={{ fontSize: '14px' }}>Bar chart showing stock levels for all commodities nationally.</p> */}
                            <HighchartsReact highcharts={Highcharts} options={{
                                chart: {
                                    type: 'pie'
                                },
                                title: {
                                    text: 'Reporting rates'
                                },
                                colors: ['#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee'],
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: true,
                                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                        }
                                    }
                                },
                                series: [{
                                    name: 'Reporting rates',
                                    data: [
                                        ['Total expected reports (# labs)', this.state.reportingRates.expected],
                                        ['Submitted FCDRR reports', this.state.reportingRates.actual ? this.state.reportingRates.actual.length : 0],
                                    ]
                                }],
                                credits: {
                                    enabled: false
                                },
                                exporting: {
                                    enabled: true,
                                    filename: 'Reporting rates'
                                }
                            }} />
                            {/* <details>
                                <summary style={{ color: '#9f9f9f' }}>&nbsp;</summary>
                                <pre style={{ backgroundColor: 'aliceblue', borderRadius: '4px', padding: '5px', fontSize: '12px', border: '1px solid #dadada', maxHeight: '500px', overflowY: 'auto' }}>
                                    {JSON.stringify(this.state.reportingRates, null, 2)}
                                </pre>
                            </details> */}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card" style={{ backgroundColor: '#fafaf6', border: '1px solid transparent', borderRadius: '4px' }}>
                        <div className="card-header text-center">
                            <h5 className='text-bold mb-0 text-uppercase text-md'>Stock levels vs Losses</h5>
                        </div>
                        <div className="card-body" style={{ minHeight: '400px' }}>
                            {/* <p style={{ fontSize: '14px' }}>Bar chart showing stock levels for all commodities nationally.</p> */}
                            <HighchartsReact highcharts={Highcharts} options={{
                                chart: {
                                    type: 'column'
                                },
                                title: {
                                    text: 'Stock levels vs Expiries'
                                },
                                // colors: ['#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee'],
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: true,
                                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                        }
                                    }
                                },
                                series: [
                                    { name: 'Total commodity losses', data: [this.state.expiriesAnalysis.losses] },
                                    { name: 'Opening balance', data: [this.state.expiriesAnalysis.opening] },
                                    { name: 'Closing Balance', data: [this.state.expiriesAnalysis.closing] },
                                    { name: 'Quantity used', data: [this.state.expiriesAnalysis.used] },
                                ],
                                credits: {
                                    enabled: false
                                },
                                exporting: {
                                    enabled: true,
                                    filename: 'Stock levels vs Expiries'
                                }
                            }} />
                            {/* <details>
                                <summary style={{ color: '#9f9f9f' }}>&nbsp;</summary>
                                <pre style={{ backgroundColor: 'aliceblue', borderRadius: '4px', padding: '5px', fontSize: '12px', border: '1px solid #dadada', maxHeight: '500px', overflowY: 'auto' }}>
                                    {JSON.stringify(this.state.expiriesAnalysis, null, 2)}
                                </pre>
                            </details> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="row">
                <div className="col-md-12">
                    <div className="card" style={{ backgroundColor: '#fafaf6', border: '1px solid transparent', borderRadius: '4px' }}>
                        <div className="card-header text-center">
                            <h5 className='text-bold mb-0 text-uppercase text-md'>Commodity Comsumption Summary</h5>
                        </div>
                        <div className="card-body" style={{ minHeight: '400px' }}>
                            {this.state.allReports && this.state.allReports.length > 0 ? <div className='table-responsive'>
                                <table className='table table-condensed table-striped'>
                                    <thead>
                                        <tr>
                                            {Object.keys(this.state.allReports[0]).map((key, index) => {
                                                let toIgnore = [
                                                    'id',
                                                    'commodity_id',
                                                    'unit_of_issue',
                                                    'created_at',
                                                    'updated_at',
                                                    'submission_id',
                                                    'user_id',
                                                ]
                                                if (toIgnore.includes(key)) {
                                                    return null
                                                }
                                                return (
                                                    <th className='text-xs' key={index}>{key.split('_').join(' ').toLocaleUpperCase()}</th>
                                                )
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.allReports && this.state.allReports.length>0 && this.state.allReports.map((report, index) => (
                                            <tr key={index}>
                                                {Object.keys(report).map((key, index) => {
                                                    let toIgnore = [
                                                        'id',
                                                        'commodity_id',
                                                        'unit_of_issue',
                                                        'created_at',
                                                        'updated_at',
                                                        'submission_id',
                                                        'user_id',
                                                    ]
                                                    if (toIgnore.includes(key)) {
                                                        return null
                                                    }
                                                    return (
                                                        <td key={index}>{report[key]}</td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div> : <div className='alert alert-warning text-sm text-center'><h5>No data available</h5></div>}
                            <details>
                                <summary style={{ color: '#9f9f9f' }}>&nbsp;</summary>
                                <pre style={{ backgroundColor: 'aliceblue', borderRadius: '4px', padding: '5px', fontSize: '12px', border: '1px solid #dadada', maxHeight: '500px', overflowY: 'auto' }}>
                                    {JSON.stringify(this.state.allReports, null, 2)}
                                </pre>
                            </details>
                        </div>
                    </div>
                </div>
            </div> */}

        </>

        let dashboardContent = [dashboardHeader, (this.state.loading ? <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '77vh' }}>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='text-center alert alert-default-info'>&nbsp;&nbsp;&nbsp;Loading...&nbsp;&nbsp;&nbsp;</div>
                    </div>
                </div>
            </div>
        </> : dashboardMain)];

        return (
            <React.Fragment>
                {dashboardContent}
            </React.Fragment>
        );
    }

}

export default FcdrrSummaryDashboard;

if (document.getElementById('fcdrr_summary_dashboard')) {
    ReactDOM.render(<FcdrrSummaryDashboard />, document.getElementById('fcdrr_summary_dashboard'));
}

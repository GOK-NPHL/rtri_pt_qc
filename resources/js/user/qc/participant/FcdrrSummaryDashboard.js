import React from 'react';
import ReactDOM from 'react-dom';
import FcdrrTool from './FcdrrTool'
import { FetchFcdrrSubmissions, DeleteFcdrrSubmissions, GetAllFcdrrSettings, exportToExcel } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";

class FcdrrSummaryDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            isSubmitResult: false,
            dtObject: null,
            message: "",
            data: [],
            currElementsTableEl: [],
            allTableElements: [],
            selectedElement: null,
            startTableData: 0,
            endeTableData: 10,
            activePage: 1,
            isEdit: false,
            editId: null,
            settings: [],
            latestDate: null,
            windowPeriod: 1000000,
            actionElement: null
        }
        this.toggleView = this.toggleView.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.deleteSubmissionHandler = this.deleteSubmissionHandler.bind(this);
        this.fetchSubmissions = this.fetchSubmissions.bind(this);
        this.daysBetween = this.daysBetween.bind(this);

    }

    componentDidMount() {

        (async () => {
            let settings = await GetAllFcdrrSettings();
            let response = await FetchFcdrrSubmissions();

            let windowPeriod = null;

            if (settings.status != 500) {
                settings.map((setting) => {
                    if (setting.name == 'window_period') {
                        windowPeriod = setting.value
                    }
                })
            }

            if (response.status == 500) {
                this.setState({
                    message: response.data.Message,
                });
                $('#messageModal').modal('toggle');
            } else {
                this.setState({
                    data: response,
                    latestDate: response[0] ? response[0].latest_date : '',
                    settings: settings,
                    windowPeriod: windowPeriod
                })
            }

        })();

    }

    componentDidUpdate(prevProps, prevState) {
        if (
            ((prevState.isSubmitResult != this.state.isSubmitResult))
        ) {

            this.fetchSubmissions();
        }
    }

    handlePageChange(pageNumber) {
        let pgNumber = pageNumber * 10 + 1;
        this.setState({
            startTableData: pgNumber - 11,
            endeTableData: pgNumber - 1,
            activePage: pageNumber
        });
    }

    updatedSearchItem(currElementsTableEl) {
        this.setState({
            currElementsTableEl: currElementsTableEl,
            activePage: 1,
            startTableData: 0,
            endeTableData: 10,
        })
    }

    deleteSubmissionHandler(id) {

        // (async () => {
        //     let response = await DeleteFcdrrSubmissions(id);
        //     this.setState({
        //         message: response.data.Message,
        //     });
        //     $('#messageModal').modal('toggle');

        // })();

        (async () => {
            if (window && window.confirm("Are you sure you want to delete this submission?")) {
                let response = await DeleteFcdrrSubmissions(id);
                this.setState({
                    message: response?.data?.Message || response?.message || 'Deleted successfully'
                })
                $('#messageModal').modal('toggle');
            } else if (!window || !window.confirm || window == undefined) {
                let response = await DeleteFcdrrSubmissions(id);
                this.setState({
                    message: response?.data?.Message || response?.message || 'Deleted successfully'
                })
                $('#messageModal').modal('toggle');
            }
        })();

        this.fetchSubmissions();
    }

    fetchSubmissions() {
        (async () => {
            let settings = await GetAllFcdrrSettings();

            let response = await FetchFcdrrSubmissions();
            this.setState({
                data: response,
                allTableElements: [],
                currElementsTableEl: [],
                settings: settings,
                latestDate: response[0] ? response[0].latest_date : '',
            })
        })();
    }

    toggleView() {
        this.setState({
            isEdit: !this.state.isEdit,
            isSubmitResult: !this.state.isSubmitResult
        })
    }

    daysBetween(date1, date2) {
        // console.log(date1, date2)
        //Get 1 day in milliseconds
        let one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        let date1_ms = date1.getTime();
        let date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        let difference_ms = date2_ms - date1_ms;
        // Convert back to days and return
        let diff = Math.round(difference_ms / one_day);
        return diff - 1;
    }

    render() {

        let tableElem = [];
        let toDayDate = new Date();
        let currDay = toDayDate.getDate();
        let currYear = toDayDate.getUTCFullYear();
        let currYMonth = toDayDate.getUTCMonth();
        let canSubmit = true;
        let isPastWindowPeriod = currDay > this.state.windowPeriod;

        if (this.state.latestDate) { //check if has last months submission
            // console.log("one");
            let lastReportDate = new Date(this.state.latestDate);
            if (
                (
                    currYear == lastReportDate.getUTCFullYear()
                    &&
                    (currYMonth - lastReportDate.getUTCMonth()) == 1
                )
                ||
                isPastWindowPeriod
            ) {
                canSubmit = false
            }

            if ( //for new year and old comparision
                (
                    (currYear - lastReportDate.getUTCFullYear()) == 1
                    &&
                    (lastReportDate.getUTCMonth() - currYMonth) == 11
                )
                ||
                isPastWindowPeriod
            ) {
                canSubmit = false
            }
        } else {
            // console.log("one 4");
            canSubmit = !isPastWindowPeriod;
        }

        if (this.state.data.length > 0) {
            this.state.data.map((element, index) => {
                tableElem.push(

                    <tr key={uuidv4()}>
                        <td>{element['lab_name']}</td>
                        <td>{new Date(element['report_date']).getUTCFullYear() + '-' + (new Date(element['report_date']).getUTCMonth() + 1)}</td>
                        <td>{new Date(element['report_date']).getUTCFullYear() + '-' + (new Date(element['report_date']).getUTCMonth() + 1)}</td>
                        <td>

                            <a
                                href="#"
                                onClick={() => {
                                    this.setState({
                                        isSubmitResult: true,
                                        isEdit: true,
                                        editId: element['id'],
                                        actionElement: element
                                    })
                                }}
                                style={{ "display": "inlineBlock", 'marginRight': '5px' }}
                                className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm text-white">
                                <i className="fas fa-edit"></i> Edit
                            </a>

                            {
                                (this.daysBetween(new Date(element['report_date']), new Date()) > this.state.windowPeriod)
                                    ?
                                    '' :
                                    <a
                                        onClick={() => this.deleteSubmissionHandler(element['id'])}
                                        style={{ "display": "inlineBlock" }}
                                        className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm text-white">
                                        <i className="fas fa-trash"></i> Delete
                                    </a>
                            }

                        </td>

                    </tr>

                );
            });
            if (this.state.allTableElements.length == 0) {
                this.setState({
                    allTableElements: tableElem,
                    currElementsTableEl: tableElem
                })
            }

        }

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

        </div>

        let dashboardMain = <>
            <div key={2} className="row">
                <div className="col-sm-12 mb-5" style={{ borderBottom: '1px solid #f6f2f4' }}>
                    <h4 className="float-left text-bold">FCDRR Summary</h4>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="card" style={{ backgroundColor: '#fafaf6', border: '1px solid transparent', borderRadius: '4px' }}>
                        <div class="card-header text-center">
                            <h5 className='text-bold mb-0 text-uppercase text-md'>Stock levels summary</h5>
                        </div>
                        <div class="card-body" style={{ minHeight: '400px' }}>
                            Bar chart showing stock levels for all commodities nationally
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card" style={{ backgroundColor: '#fafaf6', border: '1px solid transparent', borderRadius: '4px' }}>
                        <div class="card-header text-center">
                            <h5 className='text-bold mb-0 text-uppercase text-md'>Consumption vs Supply</h5>
                        </div>
                        <div class="card-body" style={{ minHeight: '400px' }}>
                            Stacked bar chart showing the consumption vs supply for each commodity (national, last month)
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <div class="card" style={{ backgroundColor: '#fafaf6', border: '1px solid transparent', borderRadius: '4px' }}>
                        <div class="card-header text-center">
                            <h5 className='text-bold mb-0 text-uppercase text-md'>Commodity Comsumption Summary</h5>
                        </div>
                        <div class="card-body" style={{ minHeight: '400px' }}>
                            Table showing adjustments (negative & positive), stock levels & days out of stock for each commodity (national, last month)
                        </div>
                    </div>
                </div>
            </div>

        </>

        let dashboardContent = [dashboardHeader, dashboardMain];

        if (this.state.isSubmitResult) {
            let repDate = new Date();
            try {
                repDate = this.state.actionElement['report_date'];
            } catch (err) {
                // console.log(err);
            }

            dashboardContent =

                <FcdrrTool
                    canUpdate={
                        this.state.isEdit &&
                        !(this.daysBetween(new Date(repDate), new Date()) > this.state.windowPeriod)
                    }
                    isEdit={this.state.isEdit}
                    editId={this.state.editId}
                    toggleView={this.toggleView} />
        }

        return (
            <React.Fragment>
                {dashboardContent}

                {/*message box */}
                <div className="modal fade" id="messageModal" tabIndex="-1" role="dialog" aria-labelledby="messageModalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Notice!</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p id="returnedMessage">{this.state.message}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default FcdrrSummaryDashboard;

if (document.getElementById('fcdrr_summary_dashboard')) {
    ReactDOM.render(<FcdrrSummaryDashboard />, document.getElementById('fcdrr_summary_dashboard'));
}

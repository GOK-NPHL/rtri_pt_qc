import React from 'react';
import ReactDOM from 'react-dom';
import FcdrrTool from './FcdrrTool'
import { FetchFcdrrSubmissions, DeleteFcdrrSubmissions, GetAllFcdrrSettings, exportToExcel } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";

class FcdrrToolDashboard extends React.Component {

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
            }else if(!window || !window.confirm || window == undefined){
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
        console.log(date1, date2)
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
            console.log("one");
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
            console.log("one 4");
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
                <h5 className="m-0 text-dark">Facility Consumption Data Report & Requisition for ASANTE</h5>
            </div>
            <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item"><a href="/dashboard">RTRI QC</a></li>
                    <li className="breadcrumb-item active">Dashboard</li>
                </ol>
            </div>

        </div>

        let dashboardTable =
            <div key={2} className="row">
                <div className="col-sm-12">
                    <div className="col-sm-12 mb-5">
                        <h3 className="float-left">All Submissions</h3>
                        <div className="float-right">
                            {canSubmit ?
                                <button onClick={() => {
                                    this.setState({
                                        isSubmitResult: true,
                                        isEdit: false
                                    })
                                }} type="button" className="btn btn-info">
                                    Submit result
                                </button> :
                                <p style={{ "backgroundColor": "green", "color": "white" }}>New submission closed</p>
                            }
                        </div>
                    </div>


                    <div id='user_table' className='row p-3 ' style={{backgroundColor: '#f6f6f2', border: '1px solid #d6d6d2', borderRadius: '4px'}}>
                        {this.props.isShowNewShipmentPage ? <div className="col-sm-12 mb-3 mt-3"><h3 className="float-left">All Shipments</h3> </div> : ''}
                        <div className='col-sm-12 col-md-12'>

                            <div className="row">
                                <div className="col-sm-5">
                                    <Pagination
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={10}
                                        totalItemsCount={this.state.currElementsTableEl.length}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChange.bind(this)}
                                    />
                                </div>
                                <div className="col-sm-5">
                                    <input type="text"
                                        style={{ "width": "70%", "float": "right", "marginBottom": "5px" }}
                                        onChange={(event) => {
                                            let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                                elemnt['props']['children'][0]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                                elemnt['props']['children'][1]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                                (elemnt['props']['children'][2]['props']['children'] + "").toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                                            );
                                            this.updatedSearchItem(currElementsTableEl);
                                        }}
                                        className="form-control" placeholder="search submission"></input>
                                </div>
                                <div className='col-sm-2 text-right'>
                                    <button type="button" className="btn btn-success btn-sm mx-1" onClick={() => {
                                        let final_data = this.state.data.map(element => {
                                            delete element['id'];
                                            return element;
                                        });
                                        exportToExcel(final_data, 'all-submissions')
                                    }}>
                                        <i className='fa fa-download'></i>&nbsp;
                                        Excel/CSV
                                    </button>
                                </div>
                            </div>

                            <table className="table table-striped table-sm bg-white table-hover">
                                <thead>
                                    <tr>
                                        <th>Laboratory</th>
                                        <th>Start month</th>
                                        <th>End month</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.currElementsTableEl.slice(this.state.startTableData, this.state.endeTableData)}
                                </tbody>

                            </table>
                            <br />
                            <Pagination
                                itemClass="page-item"
                                linkClass="page-link"
                                activePage={this.state.activePage}
                                itemsCountPerPage={10}
                                totalItemsCount={this.state.currElementsTableEl.length}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange.bind(this)}
                            />
                        </div>
                    </div>

                </div>
            </div>;

        let dashboardContent = [dashboardHeader, dashboardTable];

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

export default FcdrrToolDashboard;

if (document.getElementById('fcdrr_tool_dashboard')) {
    ReactDOM.render(<FcdrrToolDashboard />, document.getElementById('fcdrr_tool_dashboard'));
}

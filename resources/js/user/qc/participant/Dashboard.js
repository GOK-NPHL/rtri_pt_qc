import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import SubmitResults from './SubmitResults'
import { FetchSubmissions, DeleteSubmissions, SubmitQC, exportToExcel, fetchCurrentUserParams } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            isSubmitResult: false,
            dtObject: null,
            message: "ff",
            data: [],
            currElementsTableEl: [],
            allTableElements: [],
            selectedElement: null,
            startTableData: 0,
            endeTableData: 10,
            activePage: 1,
            isEdit: false,
            editId: null,
            userParams: {}
        }
        this.toggleView = this.toggleView.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.deleteSubmissionHandler = this.deleteSubmissionHandler.bind(this);
        this.fetchSubmissions = this.fetchSubmissions.bind(this);
    }

    componentDidMount() {

        (async () => {
            let response = await FetchSubmissions();
            this.setState({
                data: response,
            })
        })();
        (async () => {
            let response = await fetchCurrentUserParams();
            this.setState({
                userParams: response,
            })
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
        console.log(`active page is ${pageNumber}`);
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
        //     let response = await DeleteSubmissions(id);
        //     console.log(response)
        //     this.setState({
        //         message: response.data.Message,
        //     });
        //     $('#messageModal').modal('toggle');

        // })();

        (async () => {
            if (window && window.confirm("Are you sure you want to delete this submission?")) {
                let response = await DeleteSubmissions(id);
                this.setState({
                    message: response?.data?.Message || response?.message || 'Deleted successfully'
                })
                $('#messageModal').modal('toggle');
            } else if (!window || !window.confirm || window == undefined) {
                let response = await DeleteSubmissions(id);
                this.setState({
                    message: response?.data?.Message || response?.message || 'Deleted successfully'
                })
                $('#messageModal').modal('toggle');
            }
        })();

        this.fetchSubmissions();
    }
    submitSubmissionHandler(id) {
        (async () => {
            if (window && window.confirm("Are you sure you want to submit this?")) {
                let response = await SubmitQC(id);
                this.setState({
                    message: response?.data?.Message || response?.message || 'Submitted successfully'
                })
                $('#messageModal').modal('toggle');
            } else if (!window || !window.confirm || window == undefined) {
                let response = await SubmitQC(id);
                this.setState({
                    message: response?.data?.Message || response?.message || 'Submitted successfully'
                })
                $('#messageModal').modal('toggle');
            }
        })();

        this.fetchSubmissions();
    }

    fetchSubmissions() {
        (async () => {
            let response = await FetchSubmissions();
            this.setState({
                data: response,
                allTableElements: [],
                currElementsTableEl: []
            })
        })();
    }

    toggleView() {
        this.setState({
            isEdit: !this.state.isEdit,
            isSubmitResult: !this.state.isSubmitResult
        })
    }

    render() {

        let tableElem = [];

        if (this.state.data.length > 0 && this.state.userParams && this.state.userParams.roles && this.state.userParams.roles.length > 0) {
            // console.log(this.state.data);
            this.state.data.map((element, index) => {
                tableElem.push(

                    <tr key={uuidv4()}>
                        <td>RTRI QC</td>
                        <td>{element['lab_name']}</td>
                        <td>{element['kit_date_received']}</td>
                        <td>{element['kit_lot_no']}</td>
                        <td>{element['testing_date']}</td>
                        <td>
                            {element['submitted'] == 1 || element['submitted'] == true ? 'Yes' : <>
                                No&nbsp;
                                {this.state.userParams.permissions.includes("edit_qc") && <a
                                    href="#"
                                    onClick={() => this.submitSubmissionHandler(element['id'])}
                                    style={{ "display": "inlineBlock", 'marginRight': '5px' }}
                                    className="btn btn-xs text-xs btn-success text-white">
                                    Submit now
                                </a>}
                            </>}
                        </td>
                        <td>
                            {this.state.userParams.permissions.includes("edit_qc") && <>
                                {((
                                    this.state.userParams.roles.filter(rl => rl.name == "Administrator").length > 0 ||
                                    this.state.userParams.permissions.includes("edit_qc_after_submission")
                                ) ? <>
                                    <a
                                        href="#"
                                        onClick={() => {
                                            this.setState({
                                                isSubmitResult: true,
                                                isEdit: true,
                                                editId: element['id']
                                            })
                                        }}
                                        style={{ "display": "inlineBlock", 'marginRight': '5px' }}
                                        className="d-none d-sm-inline-block btn btn-sm text-xs btn-info text-white">
                                        <i className="fas fa-edit"></i> Edit
                                    </a>
                                    <a
                                        onClick={() => this.deleteSubmissionHandler(element['id'])}
                                        style={{ "display": "inlineBlock" }}
                                        className="d-none d-sm-inline-block btn btn-sm text-xs btn-danger text-white">
                                        <i className="fas fa-trash"></i> Delete
                                    </a>
                                </> : ( element['submitted'] != 1 && element['submitted'] != true &&<>
                                    {this.state.userParams.permissions.includes("edit_qc") && <a
                                        href="#"
                                        onClick={() => {
                                            this.setState({
                                                isSubmitResult: true,
                                                isEdit: true,
                                                editId: element['id']
                                            })
                                        }}
                                        style={{ "display": "inlineBlock", 'marginRight': '5px' }}
                                        className="d-none d-sm-inline-block btn btn-sm text-xs btn-info text-white">
                                        <i className="fas fa-edit"></i> Edit
                                    </a>}
                                    {this.state.userParams.permissions.includes("delete_qc") && <a
                                        onClick={() => this.deleteSubmissionHandler(element['id'])}
                                        style={{ "display": "inlineBlock" }}
                                        className="d-none d-sm-inline-block btn btn-sm text-xs btn-danger text-white">
                                        <i className="fas fa-trash"></i> Delete
                                    </a>}
                                </>))}
                            </>}
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

        let dashboardHeader = <div key={1} className="row mb-5">
            <div className="col-sm-6">
                <h1 className="m-0 text-dark">RTRI QC</h1>
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
                            {this.state.userParams && this.state.userParams.roles && this.state.userParams.roles.length > 0 && this.state.userParams.permissions.includes("add_qc") && <button onClick={() => {
                                this.setState({
                                    isSubmitResult: true,
                                    isEdit: false
                                })
                            }} type="button" className="btn btn-info">Submit result</button>}
                        </div>
                    </div>


                    <div id='user_table' className='row p-3 ' style={{ backgroundColor: '#f6f6f2', border: '1px solid #d6d6d2', borderRadius: '4px' }}>
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
                                            // console.log(this.state.allTableElements);
                                            let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                                elemnt['props']['children'][0]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                                elemnt['props']['children'][1]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                                (elemnt['props']['children'][3]['props']['children'] + "").toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
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
                                <thead className='text-uppercase'>
                                    <tr>
                                        <th>Scheme</th>
                                        <th>Laboratory</th>
                                        <th>Kit Date Received</th>
                                        <th>Kit Lot No</th>
                                        <th>Testing Date</th>
                                        <th>Submitted?</th>
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
            dashboardContent = <SubmitResults isEdit={this.state.isEdit} editId={this.state.editId} toggleView={this.toggleView} />
        }

        return (
            <React.Fragment>
                {dashboardContent}
                {/* {window && window.location && window.location.href.includes('localhost') && <details style={{ color: '#777', marginTop: '2.3em' }}><summary>User params:</summary><pre style={{ whiteSpace: 'pre-wrap' }}>
                    {this.state.userParams && this.state.userParams.roles && this.state.userParams.roles.length > 0 && JSON.stringify(this.state.userParams, null, 2)}
                </pre></details>} */}
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

export default Dashboard;

if (document.getElementById('dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
}

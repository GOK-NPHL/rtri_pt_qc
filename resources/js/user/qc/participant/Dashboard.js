import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import SubmitResults from './SubmitResults'
import { FetchSubmissions, DeleteSubmissions } from '../../../components/utils/Helpers';
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
            editId: null
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

        (async () => {
            let response = await DeleteSubmissions(id);
            console.log(response)
            this.setState({
                message: response.data.Message,
            });
            $('#messageModal').modal('toggle');

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

        if (this.state.data.length > 0) {
            console.log(this.state.data);
            this.state.data.map((element, index) => {
                tableElem.push(

                    <tr key={uuidv4()}>
                        <td>RIRI QC</td>
                        <td>{element['lab_name']}</td>
                        <td>{element['kit_date_received']}</td>
                        <td>{element['kit_lot_no']}</td>
                        <td>{element['testing_date']}</td>
                        <td>
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
                                className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm">
                                <i className="fas fa-user-edit"></i>
                            </a>
                            <a
                                onClick={() => this.deleteSubmissionHandler(element['id'])}
                                style={{ "display": "inlineBlock" }}
                                className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm">
                                <i className="fas fa-user-times"></i>
                            </a>
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
                            <button onClick={() => {
                                this.setState({
                                    isSubmitResult: true,
                                    isEdit: false
                                })
                            }} type="button" className="btn btn-info">Submit result</button>
                        </div>
                    </div>


                    <div id='user_table' className='row'>
                        {this.props.isShowNewShipmentPage ? <div className="col-sm-12 mb-3 mt-3"><h3 className="float-left">All Shipments</h3> </div> : ''}
                        <div className='col-sm-12 col-md-12'>

                            <div className="row">
                                <div className="col-sm-6">
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
                                <div className="col-sm-6">
                                    <input type="text"
                                        style={{ "width": "70%", "float": "right", "marginBottom": "5px" }}
                                        onChange={(event) => {
                                            console.log(this.state.allTableElements);
                                            let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                                elemnt['props']['children'][0]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                                elemnt['props']['children'][1]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                                (elemnt['props']['children'][3]['props']['children'] + "").toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                                            );
                                            this.updatedSearchItem(currElementsTableEl);
                                        }}
                                        className="form-control" placeholder="search submission"></input>
                                </div>

                            </div>

                            <table className="table table-striped table-sm  table-hover">
                                <thead>
                                    <tr>
                                        <th>Scheme</th>
                                        <th>Laboratory</th>
                                        <th>Kit Date Received</th>
                                        <th>Kit Lot No</th>
                                        <th>Testing Date</th>
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
import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchAllFcdrrReports, exportToExcel, getAllCommodities } from '../../components/utils/Helpers';


class ListFcdrrReports extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            users: [],
            currElementsTableEl: [],
            allTableElements: [],
            selectedElement: null,
            allowedPermissions: [],
            userActionState: 'userList',
            startTableData: 0,
            endeTableData: 10,
            activePage: 1,
        }
        this.handlePageChange = this.handlePageChange.bind(this)
    }

    componentDidMount() {

        (async () => {
            let response = await FetchAllFcdrrReports();
            this.setState({
                data: response
            });
        })();

        (async () => {
            let al_c = await getAllCommodities();
            if (al_c.status == 200) {
                this.setState({
                    all_commodities: al_c.data
                });
                console.log(al_c.data);
            } else {
                this.setState({
                    all_commodities: []
                });
                console.log(al_c);
            }
        })();

    }

    deleteUser() {
        (async () => {
            let response = await DeleteUser(this.state.selectedElement);
            this.setState({
                responseMessage: response.data.Message
            });
            $('#deleteUserModal').modal('toggle');
            this.getUsers();
        })();
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

    render() {
        const imgStyle = {
            width: "100%"
        };

        const rowStle = {
            marginBottom: "5px"
        };

        let tableElem = [];

        if (this.state.data.length > 0) {

            this.state.data.map((element, index) => {

                tableElem.push(<tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{element.county}</td>
                    <td>{element.lab_name}</td>
                    <td>{new Date(element['report_date']).getUTCFullYear() + '-' + (new Date(element['report_date']).getUTCMonth() + 1)}</td>
                    <td>{new Date(element['report_date']).getUTCFullYear() + '-' + (new Date(element['report_date']).getUTCMonth() + 1)}</td>
                    {

                        <td>

                            <a

                                onClick={
                                    () => {
                                        window.location.assign('get-fcdrr-report/' + element.id)
                                    }
                                }
                                style={{ 'marginRight': '5px' }}
                                className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm">
                                <i className="fas fa-file-alt"></i> View
                            </a>
                            {/* <a
                                onClick={() => {
                                    this.setState({
                                        selectedElement: element
                                    });
                                    $('#deleteConfirmModal').modal('toggle');
                                }} className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm">
                                <i className="fas fa-user-times"></i>
                            </a> */}

                        </td>
                    }

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


        let pageContent = <div id='user_table' className='row'>
            <div className="col-sm-12 mb-3 mt-3">
                <h3 className="float-left">Fcdrr Submissions</h3>
            </div>
            <div className='col-sm-12 col-md-12'>
                <div className='row'>
                    <div className="col-md-10 form-group mb-2">
                        <input type="text"
                            style={{ maxWidth: '300px' }}
                            onChange={(event) => {
                                let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                    elemnt['props']['children'][1]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                    elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                    elemnt['props']['children'][3]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                    elemnt['props']['children'][4]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                                );
                                this.updatedSearchItem(currElementsTableEl);
                            }}
                            className="form-control" placeholder="Search"></input>
                    </div>
                    <div className='col-md-2 text-right'>
                        <button type="button" className="btn btn-success btn-sm mx-1" onClick={() => {
                            if (this.state.data && this.state.data.length > 0) {
                                let final_data = this.state.data.map(element => {
                                    console.log('>>> ', element)
                                    return {
                                        'Submitted': (element['submitted'] == 1 || element['submitted'] == 'true' || element['submitted'] == true) ? 'YES' : 'NO',
                                        'Commodities': JSON.parse(element['commodities']).map(cdt => {
                                            let nm = this.state.all_commodities.find(elem => elem['id'] == cdt);
                                            return nm ? nm['commodity_name'] : cdt;
                                        }).join(','),
                                        'County': element.county,
                                        'Lab/Facility': element.lab_name,
                                        'Start month': new Date(element['report_date']).getUTCFullYear() + '-' + (new Date(element['report_date']).getUTCMonth() + 1),
                                        'End month': new Date(element['report_date']).getUTCFullYear() + '-' + (new Date(element['report_date']).getUTCMonth() + 1),
                                    }
                                })
                                exportToExcel(final_data, 'fcdrr-reports');
                            } else {
                                console.error('No data to export');
                                alert('No data to export')
                            }
                        }}>
                            <i className='fa fa-download'></i>&nbsp;
                            Excel/CSV
                        </button>
                    </div>
                </div>

                <table className="table table-striped table-sm  table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">County</th>
                            <th scope="col">Lab Name</th>
                            <th scope="col">Start Month</th>
                            <th scope="col">End Month</th>
                            <th scope="col">Action</th>
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
        </div >;

        return (
            <React.Fragment>
                {pageContent}
            </React.Fragment>
        );
    }

}

export default ListFcdrrReports;

if (document.getElementById('list_fcdrr_report')) {
    ReactDOM.render(<ListFcdrrReports />, document.getElementById('list_fcdrr_report'));
}
import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchParticipantList, exportToExcel, getAllCommodities } from '../../../components/utils/Helpers';


class ListLab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
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
            let response = await FetchParticipantList();
            this.setState({
                data: response
            });
            console.log(response);
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
                    <td>{element.mfl_code}</td>
                    <td>{element.lab_name}</td>
                    <td>{element.email}</td>
                    <td>{element.commodities ? <>
                        {JSON.parse(element.commodities).length}
                    </> : 0}</td>
                    <td>{element.is_active ? 'Active' : 'Inactive'}</td>

                    {

                        <td>

                            <a
                                onClick={
                                    () => {
                                        window.location.assign('edit-lab/' + element.id)
                                    }
                                }
                                style={{ 'marginRight': '5px' }}
                                className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm text-white">
                                <i className="fas fa-edit"></i> Edit
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
                <h3 className="float-left">Laboratory List</h3>
                <a style={{ "color": "white" }} type="button" href="add-lab" className="btn btn-info float-right">Add Participant</a>
            </div>
            <div className='col-sm-12 col-md-12'>
                <div className='row'>
                    <div className="col-md-10 form-group mb-2">
                        <input type="text"
                            style={{ maxWidth: '300px' }}
                            onChange={(event) => {
                                console.log(this.state.allTableElements);
                                let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                    elemnt['props']['children'][1]['props']['children'].toString().toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                    elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                    elemnt['props']['children'][3]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                                );
                                this.updatedSearchItem(currElementsTableEl);
                            }}
                            className="form-control" placeholder="Search"></input>
                    </div>
                    <div className='col-md-2 text-right'>
                        <button type="button" className="btn btn-success btn-sm mx-1" onClick={() => {
                            if (this.state.data && this.state.data.length > 0) {
                                let final_data = this.state.data.map(element => {
                                    return {
                                        'MFL code': element.mfl_code,
                                        'lab/facility name': element.lab_name,
                                        email: element.email,
                                        status: element.is_active == 1 ? 'Active' : 'Inactive'
                                    }
                                })
                                exportToExcel(final_data, 'Labs facilities list');
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
                            <th scope="col">Facility Code</th>
                            <th scope="col">Lab Name</th>
                            <th scope="col">Email</th>
                            <th scope="col"># Commodities</th>
                            <th scope="col">Status</th>
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
        </div>;

        return (
            <React.Fragment>
                {pageContent}
            </React.Fragment>
        );
    }

}

export default ListLab;

if (document.getElementById('list_lab')) {
    ReactDOM.render(<ListLab />, document.getElementById('list_lab'));
}
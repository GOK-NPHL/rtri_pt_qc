import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import { SaveLabPersonel, FetchParticipantList } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import './PtShipment.css';
import ReactTooltip from 'react-tooltip';

class AddShipement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            isSubmitResult: false,
            dtObject: null,
            message: '',
            email: '',
            facility: '',
            firstName: '',
            secondName: '',
            phoneNumber: '',
            password: '',
            hasQcAccess: true,
            hasPtAccess: true,
            isActive: 'true',
            participantList: [],
            tableRows: []
        }

        this.handleFacilityChange = this.handleFacilityChange.bind(this);
        this.handleIsActiveChange = this.handleIsActiveChange.bind(this);
        this.addSampleRow = this.addSampleRow.bind(this);
        this.deleteSampleRow = this.deleteSampleRow.bind(this);

    }

    componentDidMount() {

    }


    handleIsActiveChange(isActive) {

        this.setState({
            isActive: isActive
        });
    }

    handleFacilityChange(facility) {
        this.setState({
            facility: facility
        });
    }



    savePersonel() {

        if (
            this.state.facility == '' ||
            this.state.email == '' ||
            this.state.phoneNumber == '' ||
            this.state.firstName == '' ||
            this.state.password == ''

        ) {
            this.setState({
                message: "Kindly fill the required fileds marked in *"
            });
            $('#addShipmentModal').modal('toggle');
        } else {

            (async () => {
                let personel = {};
                personel['email'] = this.state.email;
                personel['facility'] = this.state.facility;
                personel['first_name'] = this.state.firstName;
                personel['second_name'] = this.state.secondName ? this.state.secondName : null;
                personel['phone_number'] = this.state.phoneNumber;
                personel['password'] = this.state.password;
                personel['has_qc_access'] = this.state.hasQcAccess ? 1 : 0;
                personel['has_pt_access'] = this.state.hasPtAccess ? 1 : 0;
                personel['is_active'] = this.state.isActive == 'true' ? 1 : 0;

                let response = await SaveLabPersonel(personel);

                if (response.status == 200) {
                    this.setState({
                        message: response.data.Message,
                        email: '',
                        facility: '',
                        firstName: '',
                        secondName: '',
                        phoneNumber: '',
                        password: '',
                        hasQcAccess: true,
                        hasPtAccess: true,
                    });
                } else {
                    this.setState({
                        message: response.data.Message,
                    });
                }
                $('#addShipmentModal').modal('toggle');
            })();
        }

    }

    deleteSampleRow(index) {
        console.log(index);

        let tableRows = this.state.tableRows;
        delete tableRows[index]
        this.setState({
            tableRows: tableRows
        })
    }

    addSampleRow(index) {
        let tableRows = this.state.tableRows;
        let tableRow = <tr key={uuidv4()}>
            <td className="px-lg-2" style={{ "maxWidth": "150px" }}>
                <input className="form-control" placeholder="please enter sample name" />
            </td>
            {/* <td onChange={this.qcInterpretationLongterm.bind(this)}> */}
            <td style={{ "maxWidth": "150px" }}>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" value="lt"
                        name={index + "long-term-radio"} id={index + "result_lt"} />
                    <label className="form-check-label" htmlFor={index + "result_lt"} >
                        LT
                    </label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" value="recent"
                        name={index + "long-term-radio"} id={index + "result_recent"} />
                    <label className="form-check-label" htmlFor={index + "result_recent"} >
                        recent
                    </label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" value="neg"
                        name={index + "long-term-radio"} id={index + "result_neg"} />
                    <label className="form-check-label" htmlFor={index + "result_neg"} >
                        neg
                    </label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" value="invalid"
                        name={index + "long-term-radio"} id={index + "result_invalid"} />
                    <label className="form-check-label" htmlFor={index + "result_invalid"} >
                        invalid
                    </label>
                </div>
            </td>
            <td>

                <ReactTooltip />
                <a onClick={() => this.deleteSampleRow(index)} data-tip="Delete sample">
                    <i style={{ "color": "red" }} className="fa fa-minus-circle" aria-hidden="true"></i>
                </a>

            </td>
        </tr>;
        tableRows.push(tableRow);
        this.setState({
            tableRows: tableRows
        });

    }


    render() {

        return (
            <React.Fragment>

                <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                    <div className="card-body">

                        <div className="form-row">

                            <div className="col-md-6 mb-3">
                                <label htmlFor="u_round" >Round Name *</label>
                                <input
                                    value={this.state.round}
                                    onChange={(event) => this.handleRoundChange(event.target.value)} type="text"
                                    className="form-control" id="u_round" />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="u_shipment_code" >Shipment Code *</label>
                                <input
                                    value={this.state.shipmentCode}
                                    onChange={(event) => this.handleShipmentCodeChange(event.target.value)} type="text"
                                    className="form-control" id="u_shipment_code" />
                            </div>

                        </div>


                        <div className="form-row">
                            {/* add */}
                            <div className="col-md-6 mb-3">
                                <label htmlFor="u_result_due_date" >Result Due Date  *</label>
                                <input
                                    value={this.state.resultDueDate}
                                    onChange={(event) => this.handleResultDueDateChange(event.target.value)}
                                    type="date" className="form-control" id="u_result_due_date" />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="u_pass_mark" >Pass mark (%)*</label>

                                <input
                                    value={this.state.passMark}
                                    min={0}
                                    max={100}
                                    value={80}
                                    onChange={(event) => this.handlePassMarkChange(event.target.value)}
                                    type="number" className="form-control" id="u_pass_mark" />
                            </div>

                        </div>


                        <div className="form-row">

                            <div className="col-sm-12 mb-3">
                                <label htmlFor="test_instructions" >Testing Instructions *</label>
                                <textarea
                                    value={this.state.testInstructions}
                                    onChange={(event) => this.handleTestInstructionsChange(event.target.value)}
                                    className="form-control" id="test_instructions" rows="3"></textarea>
                            </div>
                        </div>

                        <div className="form-row mt-2 bg-white">
                            <div className="col-sm-12">

                                <h5>Panel log</h5>
                                <hr />
                            </div>
                        </div>

                        <div className="form-row bg-white">

                            <div className="col-sm-12">
                                <table className="table unstrip table-bordered table-sm ">
                                    <thead>
                                        <tr>
                                            <th scope="col">Sample *</th>
                                            <th scope="col">Reference result *</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {this.state.tableRows.map((row) => {
                                            if (row != undefined)
                                                return row;
                                        })}
                                        <tr>
                                            <td>
                                                <a onClick={() => {
                                                    this.addSampleRow(this.state.tableRows.length)
                                                }}>
                                                    <ReactTooltip />
                                                    <i data-tip="Add sample" style={{ "color": "blue" }} className="fas fa-plus-circle fa-2x"></i>
                                                </a>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <div className="form-group row mt-4">
                            <div className="col-sm-12 text-center">
                                <a href="#" onClick={() => this.savePersonel()} type="" className="d-inline m-2 btn btn-primary m">Ship Round</a>
                                <a href="#" className="d-inline m-2 btn btn-danger">Cancel</a>
                            </div>
                        </div>

                    </div>
                </div>

                < div className="modal fade" id="addShipmentModal" tabIndex="-1" role="dialog" aria-labelledby="addShipmentModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addShipmentModalTitle">Notice!</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {
                                    this.state.message ? this.state.message : ''
                                }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div >
            </React.Fragment>
        );
    }

}

export default AddShipement;
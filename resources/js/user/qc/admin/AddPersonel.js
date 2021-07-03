import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import { SaveLabPersonel, FetchParticipantList } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';


class AddPersonel extends React.Component {

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
            participantList: []
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleFacilityChange = this.handleFacilityChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleSecondNameChange = this.handleSecondNameChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleIsQcActiveChange = this.handleIsQcActiveChange.bind(this);
        this.handleIsPtActiveChange = this.handleIsPtActiveChange.bind(this);


    }

    componentDidMount() {

        (async () => {
            let participantList = await FetchParticipantList();
            this.setState({
                participantList: participantList
            })
        })();

    }

    handleFacilityChange(facility) {
        console.log(facility);
        this.setState({
            facility: facility
        });
    }

    handleEmailChange(email) {
        this.setState({
            email: email
        });
    }


    handleIsQcActiveChange(hasQcAccess) {
        this.setState({
            hasQcAccess: hasQcAccess
        });
    }

    handleIsPtActiveChange(hasPtAccess) {
        this.setState({
            hasPtAccess: hasPtAccess
        });
    }

    handlePhoneChange(phoneNumber) {
        this.setState({
            phoneNumber: phoneNumber
        });
    }

    handleFirstNameChange(firstName) {
        this.setState({
            firstName: firstName
        });
    }

    handleSecondNameChange(secondName) {
        this.setState({
            secondName: secondName
        });
    }

    handlePasswordChange(password) {
        this.setState({
            password: password
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
            console.log(this.state.facility, " ", this.state.email, " ", this.state.phoneNumber, " ", this.state.firstName, " ", this.state.password)
            this.setState({
                message: "Kindly fill the required fileds marked in *"
            });
            $('#addLabModal').modal('toggle');
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
                $('#addLabModal').modal('toggle');
            })();
        }

    }
    componentDidUpdate() {
        $('#u_facility').selectpicker();
    }

    render() {
        let labLists = [];
        this.state.participantList.map((participant) => {
            labLists.push(<option key={participant.id} value={participant.id}>{participant.lab_name}</option>);
        });

        let labSelect = <div>No Facility defined</div>;
        if (this.state.participantList.length != 0) {
            labSelect = <select
                id="u_facility"
                value={this.state.facility}
                onChange={(event) => this.handleFacilityChange(event.target.value)} type="text"
                data-dropup-auto="false"
                data-live-search="true"
                // className="selectpicker form-control dropup">
                className="form-control"
            >
                {labLists}
            </select>;
        }

        return (
            <React.Fragment>

                <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                    <div className="card-body">
                        <h5 className="card-title">Add New Lab Personel</h5><br />
                        <hr />
                        <div>
                            <form action="#" >

                                <div className="form-row">

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_email" >Login (Primary email) *</label>
                                        <input
                                            value={this.state.email}
                                            onChange={(event) => this.handleEmailChange(event.target.value)} type="email"
                                            className="form-control" id="u_email" />
                                    </div>

                                    {/* add */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_facility" >Facility  *</label>

                                        {labSelect}
                                    </div>
                                </div>


                                <div className="form-row">
                                    {/* add */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_first_name" >First Name  *</label>
                                        <input
                                            value={this.state.firstName}
                                            onChange={(event) => this.handleFirstNameChange(event.target.value)}
                                            type="text" className="form-control" id="u_first_name" />
                                    </div>



                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_second_name" >Second Name</label>

                                        <input
                                            value={this.state.secondName}
                                            onChange={(event) => this.handleSecondNameChange(event.target.value)}
                                            type="text" className="form-control" id="u_second_name" />
                                    </div>


                                </div>


                                <div className="form-row">

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_phone" >Phone Number  *</label>
                                        <input
                                            value={this.state.phoneNumber}
                                            onChange={(event) => this.handlePhoneChange(event.target.value)} type="text"
                                            className="form-control" id="u_phone" />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_password" >Password  *</label>
                                        <input
                                            value={this.state.password}
                                            onChange={(event) => this.handlePasswordChange(event.target.value)}
                                            type="email" className="form-control" id="u_password" />
                                    </div>
                                </div>

                                <div className="form-row">

                                    <div className="col-md-6 mb-3">

                                        <input
                                            value={this.state.hasQcAccess}
                                            onChange={(event) => this.handleIsQcActiveChange(event.target.value)}
                                            type="checkbox"
                                            id="u_qc_access" />
                                        <label className="ml-3" htmlFor="u_qc_access" >Has QC Access</label>

                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <input
                                            value={this.state.hasPtAccess}
                                            onChange={(event) => this.handleIsPtActiveChange(event.target.value)}
                                            type="checkbox"
                                            id="u_pt_access" />
                                        <label className="ml-3" htmlFor="u_pt_access" > Has PT Access</label>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-12 text-center">
                                        <a href="#" onClick={() => this.savePersonel()} type="" className="d-inline m-2 btn btn-primary m">Add</a>
                                        <a href="list-lab" className="d-inline m-2 btn btn-danger">Cancel</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                < div className="modal fade" id="addLabModal" tabIndex="-1" role="dialog" aria-labelledby="addLabModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addLabModalTitle">Notice!</h5>
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

export default AddPersonel;

if (document.getElementById('add_personel')) {
    ReactDOM.render(<AddPersonel />, document.getElementById('add_personel'));
}
import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import { SaveAdminUser } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';


class AddUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            isSubmitResult: false,
            dtObject: null,
            message: '',
            name: '',
            email: '',
            phoneNumber: '',
            password: ''
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
    }

    componentDidMount() {

        (async () => {
            // let response = await FetchSubmissions();
        })();

    }

    handleNameChange(name) {
        this.setState({
            name: name
        });
    }

    handleEmailChange(email) {
        this.setState({
            email: email
        });
    }

    handlePasswordChange(password) {
        this.setState({
            password: password
        });
    }

    handlePhoneChange(phoneNumber) {
        this.setState({
            phoneNumber: phoneNumber
        });
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (
    //         prevState.email != this.state.email ||
    //         prevState.phoneNumber != this.state.phoneNumber ||
    //         prevState.name != this.state.name ||
    //         prevState.password != this.state.password
    //     ) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }
    saveUser() {
        
        if (
            this.state.name == '' ||
            this.state.email == '' ||
            this.state.phoneNumber == '' ||
            this.state.password == ''
        ) {
            this.setState({
                message: "Kindly fill all fileds in the form"
            })
            $('#addAdminUserModal').modal('toggle');
        } else {
            (async () => {
                let user = {};
                user['name'] = this.state.name
                user['email'] = this.state.email
                user['phone_number'] = this.state.phoneNumber
                user['password'] = this.state.password
                let response = await SaveAdminUser(user);
                console.log(response);
                this.setState({
                    message: response.data.Message,
                    name: '',
                    phoneNumber: '',
                    password: '',
                    email: ''
                });
                $('#addAdminUserModal').modal('toggle');

            })();
        }

    }

    render() {

        return (
            <React.Fragment>

                <div className="card" style={{"backgroundColor": "#ecf0f1"}}>
                    <div className="card-body">
                        <h5 className="card-title">Add New User</h5><br />
                        <hr />
                        <div style={{ "margin": "0 auto", "width": "60%" }} className="text-center">
                            <form action="#" >
                                <div className="form-group row">
                                    <label htmlFor="u_mail" className="col-sm-2 col-form-label">Email *</label>
                                    <div className="col-sm-10">
                                        <input 
                                        value={this.state.email}
                                        onChange={(event) => this.handleEmailChange(event.target.value)} 
                                        type="email" className="form-control" id="u_mail" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="u_name" className="col-sm-2 col-form-label">Name *</label>
                                    <div className="col-sm-10">
                                        <input 
                                        value={this.state.name}
                                        onChange={(event) => this.handleNameChange(event.target.value)} type="text"
                                         className="form-control" id="u_name" />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="u_phone" className="col-sm-2 col-form-label">Phone No. *</label>
                                    <div className="col-sm-10">
                                        <input 
                                        value={this.state.phoneNumber}
                                        onChange={(event) => this.handlePhoneChange(event.target.value)} type="text" 
                                        className="form-control" id="u_phone" />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="u_password" className="col-sm-2 col-form-label">Password *</label>
                                    <div className="col-sm-10">
                                        <input 
                                        value={this.state.password}
                                        onChange={(event) => this.handlePasswordChange(event.target.value)} 
                                        type="text" className="form-control" id="u_password" />
                                    </div>
                                </div>


                                <div className="form-group row">
                                    <div className="col-sm-10">
                                        <a href="#"  onClick={() => this.saveUser()} type="" className="d-inline m-2 btn btn-primary m">Add</a>
                                        <a href="list-admin-user" className="d-inline m-2 btn btn-danger">Cancel</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                < div className="modal fade" id="addAdminUserModal" tabIndex="-1" role="dialog" aria-labelledby="addAdminUserModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addAdminUserModalTitle">Notice!</h5>
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

export default AddUser;

if (document.getElementById('add_admin_user')) {
    ReactDOM.render(<AddUser />, document.getElementById('add_admin_user'));
}
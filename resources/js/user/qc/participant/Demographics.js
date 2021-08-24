import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import SubmitResults from './SubmitResults'
import { FetchSubmissions, FetchCurrentParticipantDemographics } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";

class Demographics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userDemographics: [],
            firstName: '',
            secondName: '',
            email: '',
            phoneNo: '',
            password: ''
        }

        this.onFistNameChangeHandler = this.onFistNameChangeHandler.bind(this);
        this.onSecondNameChangeHandler = this.onSecondNameChangeHandler.bind(this);
        this.onphoneNoChangeHandler = this.onphoneNoChangeHandler.bind(this);
        this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
        this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);

    }

    componentDidMount() {
        // 'users.id as user_id',
        // 'users.name',
        // 'laboratories.id as lab_id',
        // 'users.second_name',
        // 'laboratories.lab_name',
        // 'laboratories.phone_number',
        // 'laboratories.mfl_code',
        // 'laboratories.email',

        (async () => {
            let userDemographics = await FetchCurrentParticipantDemographics();

            this.setState({
                userDemographics: userDemographics,

                firstName: userDemographics[0].name,
                secondName: userDemographics[0].second_name,
                email: userDemographics[0].email,
                phoneNo: userDemographics[0].phone_number,
            })
        })();

    }

    componentDidUpdate(prevProps, prevState) {
        // if (
        //     ((prevState.isSubmitResult != this.state.isSubmitResult))
        // ) {

        //     this.fetchSubmissions();
        // }
    }


    onFistNameChangeHandler(event) {

    }
    onSecondNameChangeHandler(event) {

    }
    onphoneNoChangeHandler(event) {

    }
    onEmailChangeHandler(event) {

    }
    onPasswordChangeHandler(event) {

    }

    render() {

        return (
            <React.Fragment>

                <div style={{ "margin": "0 auto", "width": "60%" }} >
                    <h3 className="mb-5">Personal details</h3>

                    <div className="form-group row">
                        <label for="exampleInputEmail1" class="col-sm-3 col-form-label">Email address *</label>
                        <div class="col-sm-9">
                            <input type="email" className="form-control"
                                value={this.state.email}
                                onChange={() => this.onEmailChangeHandler(event)}
                                id="exampleInputEmail1" aria-describedby="emailHelp"
                                placeholder="Enter email" />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label for="name1" class="col-sm-3 col-form-label">First name *</label>
                        <div class="col-sm-9">
                            <input type="email" className="form-control" id="name1"
                                value={this.state.firstName}
                                onChange={() => this.onFistNameChangeHandler(event)}
                                aria-describedby="nameHelp" placeholder="Enter first name" />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label for="name2" class="col-sm-3 col-form-label">Second name *</label>
                        <div class="col-sm-9">
                            <input type="text" className="form-control"
                                value={this.state.secondName}
                                onChange={() => this.onSecondNameChangeHandler(event)}
                                id="name2" aria-describedby="nameHelp"
                                placeholder="Enter second name" />
                        </div>

                    </div>

                    <div className="form-group row">
                        <label for="phoneNo" class="col-sm-3 col-form-label">Phone no: *</label>
                        <div class="col-sm-9">
                            <input type="text" className="form-control" id="phoneNo"
                                value={this.state.phoneNo}
                                onChange={() => this.onphoneNoChangeHandler(event)}
                                aria-describedby="phoneNoHelp" placeholder="Enter phone no." />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label for="exampleInputPassword1" class="col-sm-3 col-form-label">Password</label>
                        <div class="col-sm-9">
                            <input type="password" className="form-control"
                                value={this.state.password}
                                onChange={() => this.onPasswordChangeHandler(event)}
                                id="exampleInputPassword1" placeholder="Password" />
                            <small style={{ "color": "red" }} className="form-text">Leave blank to retain previous password.</small>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label for="exampleInputPassword2" class="col-sm-3 col-form-label">Confirm password</label>
                        <div class="col-sm-9">
                            <input type="password" className="form-control" id="exampleInputPassword2" placeholder="Confirm password" />
                            <small style={{ "color": "red" }} className="form-text">Leave blank to retain previous password.</small>
                        </div>

                    </div>

                    <button type="submit" className="btn btn-primary">Update</button>
                </div>

            </React.Fragment>
        );
    }

}

export default Demographics;

if (document.getElementById('participant_demo')) {
    ReactDOM.render(<Demographics />, document.getElementById('participant_demo'));
}
import React from 'react';
import StatsLabel from '../../../components/utils/stats/StatsLabel';
import { SaveSubmission, FetchCurrentParticipantDemographics } from '../../../components/utils/Helpers';
import './Results.css';

class SubmitResults extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            message: '',
            qcLotReceivedDate: '',
            qcReconstituionDate: '',
            kitExpiryDate: '',
            testJustification: 'Biweekly testing as per the protocol',
            kitReceivedDate: '',
            kitLotNo: '',
            nameOfTest: '',
            qcLotNumber: '',
            testingDate: '',
            labId: '',
            userId: '',
            qcNegativeIntepreation: '',
            qcRecentIntepreation: '',
            qcLongtermIntepreation: '',
            isQcDone: true,
            resultNegative: { c: 0, v: 0, lt: 0 },
            resultRecent: { c: 0, v: 0, lt: 0 },
            resultLongterm: { c: 0, v: 0, lt: 0 },
            userDemographics: [],
            otherComments: '',
            notTestedReason: 'Issue with sample',

        }
        this.onNameOfTestHandler = this.onNameOfTestHandler.bind(this);
        this.onQcLotReceiceDateHandler = this.onQcLotReceiceDateHandler.bind(this);
        this.onKitExpiryDateHandler = this.onKitExpiryDateHandler.bind(this);
        this.onKitReceivedDateHandler = this.onKitReceivedDateHandler.bind(this);
        this.onKitLotHandler = this.onKitLotHandler.bind(this);
        this.onTestingDateHandler = this.onTestingDateHandler.bind(this);
        this.validateTestingAndRecivedDate = this.validateTestingAndRecivedDate.bind(this);
        this.onReconstitutionDateHandler = this.onReconstitutionDateHandler.bind(this);
        this.validateTestingAndReconstituionDate = this.validateTestingAndReconstituionDate.bind(this);
        this.validateTestingAndQCLotRecivedDate = this.validateTestingAndQCLotRecivedDate.bind(this);
        this.onQcLotNumberHandler = this.onQcLotNumberHandler.bind(this);
        this.onTestJustificationHandler = this.onTestJustificationHandler.bind(this);


        this.submitForm = this.submitForm.bind(this);

        this.onNameOfTestHandler = this.onNameOfTestHandler.bind(this);
        this.otherCommentsHandler = this.otherCommentsHandler.bind(this);
        this.notTestedReasonHandler = this.notTestedReasonHandler.bind(this);

    }

    componentDidMount() {

        (async () => {
            let userDemographics = await FetchCurrentParticipantDemographics();
            this.setState({
                userDemographics: userDemographics,
                labId: userDemographics[0].lab_id,
                userId: userDemographics[0].user_id
                
            });
        })();
    }

    componentDidUpdate(prevProps) {

    }

    submitForm() {
        if (
            this.state.qcLotReceivedDate.length == 0 ||
            this.state.kitExpiryDate.length == 0 ||
            this.state.kitReceivedDate.length == 0 ||
            this.state.kitLotNo.length == 0 ||
            this.state.nameOfTest.length == 0 ||
            this.state.qcLotNumber.length == 0 ||
            this.state.qcReconstituionDate.length == 0 ||
            this.state.testingDate.length == 0 ||
            (this.state.qcNegativeIntepreation.length == 0 && this.state.isQcDone) ||
            (this.state.qcRecentIntepreation.length == 0 && this.state.isQcDone) ||
            (this.state.qcLongtermIntepreation.length == 0 && this.state.isQcDone)
        ) {
            this.setState({
                message: "Fill in all the fields marked *"
            })
            $('#messageModal').modal('toggle');
        } else {
            let submission = {};
            submission["qcLotReceivedDate"] = this.state.qcLotReceivedDate;
            submission["kitExpiryDate"] = this.state.kitExpiryDate;
            submission["kitReceivedDate"] = this.state.kitReceivedDate;
            submission["kitLotNo"] = this.state.kitLotNo;
            submission["qcReconstituionDate"] = this.state.qcReconstituionDate;
            submission["testingDate"] = this.state.testingDate;
            submission["qcLotNumber"] = this.state.qcLotNumber;
            submission["qcNegativeIntepreation"] = this.state.qcNegativeIntepreation;
            submission["qcRecentIntepreation"] = this.state.qcRecentIntepreation;
            submission["qcLongtermIntepreation"] = this.state.qcLongtermIntepreation;
            submission["resultNegative"] = this.state.resultNegative;
            submission["resultRecent"] = this.state.resultRecent;
            submission["resultLongterm"] = this.state.resultLongterm;
            submission["nameOfTest"] = this.state.nameOfTest;
            submission["isQCTested"] = this.state.isQcDone;
            submission["testJustification"] = this.state.testJustification;
            submission["qcNotTestedReason"] = !this.state.isQcDone ? this.state.notTestedReason : "";
            submission["qcNotTestedOtherReason"] = !this.state.isQcDone ? this.state.otherComments : "";
            submission["labId"] = this.state.labId;
            submission["userId"] = this.state.userId;
            

            (async () => {
                let response = await SaveSubmission(submission);
                this.setState({
                    message: response.data.Message,
                });
                $('#messageModal').modal('toggle');
                if (response.status == 200) {
                    this.props.toggleView();
                }
            })();
        }
    }

    qcInterpretationNegative(event) {
        this.setState({
            qcNegativeIntepreation: event.target.value
        });
    }
    qcInterpretationRecent(event) {
        this.setState({
            qcRecentIntepreation: event.target.value
        });
    }
    qcInterpretationLongterm(event) {
        this.setState({
            qcLongtermIntepreation: event.target.value
        });
    }
    resultLongterm(event) {
        let result = this.state.resultLongterm;
        if (result[event.target.value]) {
            result[event.target.value] = 0;
        } else {
            result[event.target.value] = 1;
        }
        this.setState({
            resultLongterm: result
        });
    }
    resultRecent(event) {
        let result = this.state.resultRecent;
        if (result[event.target.value]) {
            result[event.target.value] = 0;
        } else {
            result[event.target.value] = 1;
        }
        this.setState({
            resultRecent: result
        });
    }
    resultNegative(event) {
        let result = this.state.resultNegative;
        if (result[event.target.value]) {
            result[event.target.value] = 0;
        } else {
            result[event.target.value] = 1;
        }
        this.setState({
            resultNegative: result
        });
    }
    onQcLotReceiceDateHandler(event) {
        let isValid = this.validateTestingAndQCLotRecivedDate(this.state.testingDate, event.target.value);

        if (isValid) {
            this.setState({
                qcLotReceivedDate: event.target.value
            });
        }
    }

    onQcLotNumberHandler(event) {
        this.setState({
            qcLotNumber: event.target.value
        });
    }

    onTestJustificationHandler(event) {
        this.setState({
            testJustification: event.target.value
        });
    }

    onKitExpiryDateHandler(event) {
        this.setState({
            kitExpiryDate: event.target.value
        });
    }
    onKitReceivedDateHandler(event) {
        let isValid = this.validateTestingAndRecivedDate(this.state.testingDate, event.target.value);
        if (isValid) {
            this.setState({
                kitReceivedDate: event.target.value
            });
        }

    }
    onKitLotHandler(event) {
        this.setState({
            kitLotNo: event.target.value
        });
    }
    onTestingDateHandler(event) {
        this.setState({
            testingDate: event.target.value
        });
        this.validateTestingAndRecivedDate(event.target.value, this.state.kitReceivedDate);
        this.validateTestingAndQCLotRecivedDate(event.target.value, this.state.qcLotReceivedDate);
        this.validateTestingAndReconstituionDate(this.state.qcReconstituionDate, event.target.value)
    }

    onNameOfTestHandler(event) {
        this.setState({
            nameOfTest: event.target.value
        });
    }

    onReconstitutionDateHandler(event) {

        let isValid = this.validateTestingAndReconstituionDate(event.target.value, this.state.testingDate);
        if (isValid) {
            this.setState({
                qcReconstituionDate: event.target.value
            });
        }
    }

    validateTestingAndRecivedDate(testingDate, receiveData) {
        if (testingDate < receiveData && (testingDate && receiveData)) {
            this.setState({
                message: "QC lot Date received cannot be greater than testing date",
                testingDate: '',
                kitReceivedDate: ''
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    validateTestingAndReconstituionDate(reconstituionDate, testingDate) {
        if (testingDate < reconstituionDate && (reconstituionDate && testingDate)) {
            this.setState({
                message: "Kit testing Date cannot be greater than reconstitution date",
                testingDate: '',
                qcReconstituionDate: ''
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    validateTestingAndQCLotRecivedDate(testingDate, receiveDate) {
        if (testingDate < receiveDate && (testingDate && receiveDate)) {
            this.setState({
                message: "QC lot Date received cannot be greater than testing date",
                testingDate: '',
                qcLotReceivedDate: ''
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    notTestedReasonHandler(event) {
        this.setState({
            notTestedReason: event.target.value
        });
    }

    otherCommentsHandler(event) {
        this.setState({
            otherComments: event.target.value
        });
    }
    render() {
        const labInfo = {
            backgroundColor: "#f9f9f9",
        };
        const boxLine = {
            borderTop: "1px solid grey",
            borderBottom: "1px solid grey",
            borderRight: "1px solid grey",
            paddingTop: "4px"
        }
        const boxLineLeft = boxLine;
        boxLineLeft["borderLeft"] = "1px solid grey";

        const displayInlineBlock = {
            display: "inline-block",
        }
        let today = new Date().toLocaleDateString();

        return (
            <>
                <div className="row">
                    <div className="col-sm-12 float-left">
                        <h1>RTRI QC Submission form</h1>
                        <hr />
                    </div>

                    <div className="col-sm-12 pl-4 pr-4">
                        {/* lab basic info */}
                        <div style={labInfo} className="row">
                            <div style={boxLineLeft} className="col-sm-3">
                                <strong><p>Lab code</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].mfl_code : ''}
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <strong><p>Lab Name</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].lab_name : ''}
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <strong><p>Phone No.</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].phone_number : ''}
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <strong><p>Email</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].email : ''}
                            </div>
                        </div>
                        {/* row two */}
                        <div style={labInfo} className="row mt-1">
                            <div style={boxLineLeft} className="col-sm-3">
                                <strong><p>Tester Name</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].name : ''}
                                <span> </span>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].second_name : ''}

                            </div>

                        </div>
                        {/* row two */}
                        {/* End lab basic info */}
                        <hr />
                    </div>

                    <div className="col-sm-12 mt-4 pl-4 pr-4">
                        {/* submission form  header */}
                        <div style={labInfo} className="row">
                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>Submission Date *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                {today}
                            </div>

                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>Testing Date *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <input value={this.state.testingDate} onChange={() => this.onTestingDateHandler(event)} className="form-control" type="date" />
                            </div>

                        </div>
                        {/* end submission form  header */}
                    </div>

                    <div className="col-sm-12  pl-4 pr-4 mt-2">
                        {/* Test Kit Information */}
                        Test Kit Information
                        {/* end Test Kit Information */}
                    </div>

                    <div className="col-sm-12  pl-4 pr-4">
                        {/* testing dates */}
                        <div className="row">
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Name of test *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input onChange={() => this.onNameOfTestHandler(event)} className="form-control" type="text" />
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>RTRI Kit Lot No. *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input onChange={() => this.onKitLotHandler(event)} className="form-control" type="text" />
                            </div>
                        </div>
                        {/* end testing dates */}
                    </div>

                    <div style={labInfo} className="col-sm-12  pl-4 pr-4">
                        {/* kit info */}
                        <div className="row">
                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>RTRI Kit Date Received *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input value={this.state.kitReceivedDate} onChange={() => this.onKitReceivedDateHandler(event)} className="form-control" type="date" />

                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>RTRI Kit Expiry Date *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input onChange={() => this.onKitExpiryDateHandler(event)} className="form-control" type="date" />
                            </div>
                        </div>
                        {/* end  kit info  */}

                    </div>

                    <div className="col-sm-12  pl-4 pr-4 mt-2">
                        {/* Test Kit Information */}
                        QC sample Information
                        {/* end Test Kit Information */}
                    </div>

                    <div className="col-sm-12  pl-4 pr-4">
                        {/* QC Lot info */}
                        <div className="row">
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>QC Lot Number: *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input onChange={() => this.onQcLotNumberHandler(event)} className="form-control" type="text" />
                            </div>

                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>QC Lot Date Received *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <input value={this.state.qcLotReceivedDate} onChange={() => this.onQcLotReceiceDateHandler(event)} className="form-control" type="date" />
                            </div>

                        </div>

                        <div className="row">
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Date QC Samples Reconstituted:</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <input value={this.state.qcReconstituionDate} onChange={() => this.onReconstitutionDateHandler(event)} className="form-control" type="date" />
                            </div>
                        </div>
                        {/* end  QC Lot info  */}
                        <hr />
                    </div>


                    <div className="col-sm-12  pl-4 pr-4">
                        {/* Test justification */}
                        <div className="row">
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Jutification for QC testing: *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <select
                                    value={this.state.testJustification} onChange={() => this.onTestJustificationHandler(event)}
                                    className="custom-select" aria-label="Default select example">
                                    <option selected>Biweekly testing as per the protocol</option>
                                    <option value="1">New kit lot/batch</option>
                                    <option value="2">Change in environmental conditions</option>
                                </select>
                            </div>

                        </div>
                        {/* End Test justification */}

                        <hr />
                    </div>

                    <div className="col-sm-12 mb-4  pl-4 pr-4">
                        {/* Test justification */}
                        <div className="form-check text-center">
                            <input
                                className="form-check-input"
                                onClick={() => {
                                    $("#qc-test-results").toggle();
                                    $("#test-not-done-section").toggle();
                                    this.setState({
                                        isQcDone: !this.state.isQcDone
                                    })
                                }}
                                type="checkbox"
                                value="" id="qcTestDone" />
                            <label className="form-check-label" htmlFor="qcTestDone">
                                <strong>Click here if QC test was not done?</strong>
                            </label>
                        </div>
                        {/* End Test justification */}

                    </div>

                    <div id="test-not-done-section" style={{ "display": "none" }} className="col-sm-12 mb-4 ">
                        {/* why test not done */}
                        <form style={{ "paddingRight": "20%", "paddingLeft": "20%" }}>
                            <div className="form-group" >
                                <label htmlFor="exampleFormControlSelect1">Pick a reason</label>
                                <select value={this.state.notTestedReason} onChange={() => this.notTestedReasonHandler(event)} className="form-control" id="exampleFormControlSelect1">
                                    <option selected="selected">Issue with sample</option>
                                    <option>Issue with RTRI kit lot</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleFormControlTextarea2">Other comments</label>
                                <textarea value={this.state.otherComments} onChange={() => this.otherCommentsHandler(event)} className="form-control" id="exampleFormControlTextarea2" rows="3"></textarea>
                            </div>
                        </form>
                        {/* End why test not done */}

                    </div>

                    <div id='qc-test-results' className="col-sm-12 ">

                        {/* QC Test results fields */}
                        <div className="row ml-5 mr-5">
                            <div className="col-sm-12">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>QC Sample ID</th>
                                            <th colSpan={3}>
                                                <table>
                                                    <tbody>
                                                        <tr><td>Visual Results</td></tr>
                                                        <tr style={{ "display": "block ruby" }}>
                                                            <td>Control(C) Line</td>
                                                            <td>Verification(V) Line</td>
                                                            <td>Long term(LT) Line</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </th>
                                            <th>RTRI Interpretation  *</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/*  QC - Long Term*/}
                                        <tr >
                                            <td>QC - Long Term</td>
                                            <td ><input onClick={this.resultLongterm.bind(this)} value="c" type="checkbox" /></td>
                                            <td ><input onClick={this.resultLongterm.bind(this)} value="v" type="checkbox" /></td>
                                            <td ><input onClick={this.resultLongterm.bind(this)} value="lt" type="checkbox" /></td>
                                            <td onChange={this.qcInterpretationLongterm.bind(this)}>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" value="lt"
                                                        name="long-term-radio" id="result_lt" />
                                                    <label className="form-check-label" htmlFor="result_lt">
                                                        LT
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" value="recent"
                                                        name="long-term-radio" id="result_recent" />
                                                    <label className="form-check-label" htmlFor="result_recent">
                                                        recent
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" value="neg"
                                                        name="long-term-radio" id="result_neg" />
                                                    <label className="form-check-label" htmlFor="result_neg">
                                                        neg
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" value="invalid"
                                                        name="long-term-radio" id="result_invalid" />
                                                    <label className="form-check-label" htmlFor="result_invalid">
                                                        invalid
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                        {/*  End QC - Long Term */}


                                        {/*  QC - Recent */}
                                        <tr>
                                            <td>QC - Recent</td>
                                            <td><input onClick={this.resultRecent.bind(this)} value="c" type="checkbox" /></td>
                                            <td><input onClick={this.resultRecent.bind(this)} value="v" type="checkbox" /></td>
                                            <td ><input onClick={this.resultRecent.bind(this)} value="lt" type="checkbox" /></td>
                                            <td onChange={this.qcInterpretationRecent.bind(this)}>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" value="lt"
                                                        name="recent-radio" id="result_lt" />
                                                    <label className="form-check-label" htmlFor="result_lt">
                                                        LT
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" value="recent"
                                                        name="recent-radio" id="result_recent" />
                                                    <label className="form-check-label" htmlFor="result_recent">
                                                        recent
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" value="neg"
                                                        name="recent-radio" id="result_neg" />
                                                    <label className="form-check-label" htmlFor="result_neg">
                                                        neg
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" value="invalid"
                                                        name="recent-radio" id="result_invalid" />
                                                    <label className="form-check-label" htmlFor="result_invalid">
                                                        invalid
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                        {/*  End QC - Long Recent */}


                                        {/*  QC - Negative */}
                                        <tr>
                                            <td>QC -Negative</td>
                                            <td ><input onClick={this.resultNegative.bind(this)} value="c" type="checkbox" /></td>
                                            <td ><input onClick={this.resultNegative.bind(this)} value="v" type="checkbox" /></td>
                                            <td ><input onClick={this.resultNegative.bind(this)} value="lt" type="checkbox" /></td>
                                            <td onChange={this.qcInterpretationNegative.bind(this)}>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" value="lt"
                                                        name="negative-radio" id="result_lt" />
                                                    <label className="form-check-label" htmlFor="result_lt">
                                                        LT
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" value="recent"
                                                        name="negative-radio" id="result_recent" />
                                                    <label className="form-check-label" htmlFor="result_recent">
                                                        recent
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" value="neg"
                                                        name="negative-radio" id="result_neg" />
                                                    <label className="form-check-label" htmlFor="result_neg">
                                                        neg
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" value="invalid"
                                                        type="radio" name="negative-radio" id="result_invalid" />
                                                    <label className="form-check-label" htmlFor="result_invalid">
                                                        invalid
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                        {/*  End QC - Negative */}

                                    </tbody>
                                </table>
                            </div>

                        </div>

                        {/* End QC Test results fields */}
                        <hr />

                    </div>
                    <div className="d-flex w-100 justify-content-center">

                        <button type="button " onClick={() => this.submitForm()} className="btn btn-info float-left mx-2">Submit</button>
                        <button type="button" onClick={() => {
                            this.props.toggleView();
                        }} className="btn btn-danger float-left mx-2">Cancel</button>
                    </div>
                </div>

                {/* user persist alert box */}
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
            </>
        );
    }
}

export default SubmitResults;

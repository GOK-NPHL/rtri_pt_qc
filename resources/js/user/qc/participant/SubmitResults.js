import React from 'react';
import StatsLabel from '../../../components/utils/stats/StatsLabel';
import { SaveSubmission, FetchCurrentParticipantDemographics, FetchSubmission } from '../../../components/utils/Helpers';
import './Results.css';
import LongtermKit from './LongtermKit';
import NegativeKit from './NegativeKit';
import RecentKit from './RecentKit';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from "react-datepicker";

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
            sampleType: 'DTS',
            labId: '',
            userId: '',
            qcNegativeIntepreation: '',
            qcNegativeIntepreationRepeat: [],
            qcRecentIntepreationRepeat: [],
            qcLongtermIntepreationRepeat: [],
            qcRecentIntepreation: '',
            qcLongtermIntepreation: '',
            isQcDone: true,
            resultNegative: { c: 0, v: 0, lt: 0 },
            resultNegativeRepeat: [],
            resultRecentRepeat: [],
            resultLongtermRepeat: [],
            resultRecent: { c: 0, v: 0, lt: 0 },
            resultLongterm: { c: 0, v: 0, lt: 0 },
            userDemographics: [],
            otherComments: '',
            notTestedReason: 'Issue with sample',
            negativeTestRepeats: [],
            recentTestRepeats: [],
            longtermTestRepeats: [],
            edittableSubmission: {},
            testerName: '',
            formId: null

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
        this.onSampleTypeHandler = this.onSampleTypeHandler.bind(this);
        this.validateTestingDateAndCurrentDate = this.validateTestingDateAndCurrentDate.bind(this);

        this.submitForm = this.submitForm.bind(this);

        this.onNameOfTestHandler = this.onNameOfTestHandler.bind(this);
        this.otherCommentsHandler = this.otherCommentsHandler.bind(this);
        this.notTestedReasonHandler = this.notTestedReasonHandler.bind(this);

        this.resultLongterm = this.resultLongterm.bind(this);
        this.qcInterpretationLongterm = this.qcInterpretationLongterm.bind(this);

        this.resultRecent = this.resultRecent.bind(this);
        this.qcInterpretationRecent = this.qcInterpretationRecent.bind(this);

        this.resultNegative = this.resultNegative.bind(this);
        this.qcInterpretationNegative = this.qcInterpretationNegative.bind(this);

        this.repeatNegativeTest = this.repeatNegativeTest.bind(this);
        this.deleteRepeatkit = this.deleteRepeatkit.bind(this);
        this.isRepeatsEmpty = this.isRepeatsEmpty.bind(this);

        this.repeatRecentTest = this.repeatRecentTest.bind(this);
        this.repeatLongtermTest = this.repeatLongtermTest.bind(this);
        this.onTesternameChangeHandler = this.onTesternameChangeHandler.bind(this);
    }

    componentDidMount() {

        (async () => {
            let edittableSubmission = null;
            let userDemographics = await FetchCurrentParticipantDemographics();
            if (this.props.isEdit) {
                console.log("editable");
                edittableSubmission = await FetchSubmission(this.props.editId);
                console.log(edittableSubmission);
                console.log("editable ==>");
            }

            if (this.props.isEdit) {

                let resultNegative = { c: 0, v: 0, lt: 0 };
                let resultRecent = { c: 0, v: 0, lt: 0 };
                let resultLongterm = { c: 0, v: 0, lt: 0 };

                let qcRecentIntepreation = '';
                let qcLongtermIntepreation = '';
                let qcNegativeIntepreation = '';

                edittableSubmission['test_results'].map((result) => {
                    if (result.type == 'longterm') {
                        resultLongterm['c'] = result.control_line;
                        resultLongterm['lt'] = result.longterm_line;
                        resultLongterm['v'] = result.verification_line;
                        qcLongtermIntepreation = result.interpretation;
                    }
                    if (result.type == 'negative') {
                        resultNegative['c'] = result.control_line;
                        resultNegative['lt'] = result.longterm_line;
                        resultNegative['v'] = result.verification_line;
                        qcNegativeIntepreation = result.interpretation;
                    }
                    if (result.type == 'recent') {
                        resultRecent['c'] = result.control_line;
                        resultRecent['lt'] = result.longterm_line;
                        resultRecent['v'] = result.verification_line;
                        qcRecentIntepreation = result.interpretation;
                    }
                });

                this.setState({
                    qcLotReceivedDate: new Date(edittableSubmission['data']['lot_date_received']),
                    qcReconstituionDate: new Date(edittableSubmission['data']['sample_reconstituion_date']),
                    kitExpiryDate: new Date(edittableSubmission['data']['kit_expiry_date']),
                    testJustification: edittableSubmission['data']['test_justification'],
                    kitReceivedDate: new Date(edittableSubmission['data']['kit_date_received']),
                    kitLotNo: edittableSubmission['data']['kit_lot_no'],
                    testerName: edittableSubmission['data']['tester_name'],
                    nameOfTest: edittableSubmission['data']['name_of_test'],
                    qcLotNumber: edittableSubmission['data']['qc_lot_no'],
                    testingDate: new Date(edittableSubmission['data']['testing_date']),
                    sampleType: edittableSubmission['data']['sample_type'],
                    labId: edittableSubmission['data']['lab_id'],
                    userId: edittableSubmission['data']['user_id'],

                    isQcDone: edittableSubmission['data']['qc_tested'] == 1 ? true : false,

                    resultNegativeRepeat: [],
                    resultRecentRepeat: [],
                    resultLongtermRepeat: [],

                    negativeTestRepeats: [],
                    recentTestRepeats: [],
                    longtermTestRepeats: [],

                    qcNegativeIntepreationRepeat: [],
                    qcRecentIntepreationRepeat: [],
                    qcLongtermIntepreationRepeat: [],

                    resultNegative: resultNegative,
                    resultRecent: resultRecent,
                    resultLongterm: resultLongterm,

                    qcRecentIntepreation: qcRecentIntepreation,
                    qcLongtermIntepreation: qcLongtermIntepreation,
                    qcNegativeIntepreation: qcNegativeIntepreation,

                    userDemographics: userDemographics,
                    otherComments: edittableSubmission['data']['not_test_reason'] ? edittableSubmission['data']['not_test_reason'] : '',
                    notTestedReason: edittableSubmission['data']['other_not_tested_reason'] ? edittableSubmission['data']['other_not_tested_reason'] : 'Issue with sample',
                    formId: this.props.editId
                });

            } else {
                this.setState({
                    userDemographics: userDemographics,
                    labId: userDemographics[0].lab_id,
                    userId: userDemographics[0].user_id,
                    edittableSubmission: edittableSubmission

                });

            }

        })();
    }

    componentDidUpdate(prevProps) {

    }

    submitForm() {

        //validate dates
        if (!this.validateTestingAndRecivedDate()) return;
        if (!this.validateTestingDateAndCurrentDate()) return;
        if (!this.validateTestingAndReconstituionDate()) return;
        if (!this.validateTestingAndQCLotRecivedDate()) return;

        if (
            this.state.qcLotReceivedDate.length == 0 ||
            this.state.kitExpiryDate.length == 0 ||
            this.state.kitReceivedDate.length == 0 ||
            this.state.kitLotNo.length == 0 ||
            this.state.nameOfTest.length == 0 ||
            this.state.testerName.length == 0 ||
            this.state.qcLotNumber.length == 0 ||
            this.state.qcReconstituionDate.length == 0 ||
            this.state.testingDate.length == 0 ||
            (this.state.isQcDone  && this.state.qcNegativeIntepreation.length == 0 ) ||
            (this.state.isQcDone  && this.state.qcRecentIntepreation.length == 0 ) ||
            (this.state.isQcDone  && this.state.qcLongtermIntepreation.length == 0)
        ) {
            this.setState({
                message: "Fill in all the fields marked *"
            })
            $('#messageModal').modal('toggle');
        } else {
            let submission = {};
            submission["qcLotReceivedDate"] = new Date(this.state.qcLotReceivedDate).toISOString().split('T')[0];
            submission["kitExpiryDate"] = new Date(this.state.kitExpiryDate).toISOString().split('T')[0];
            submission["kitReceivedDate"] = new Date(this.state.kitReceivedDate).toISOString().split('T')[0];
            submission["kitLotNo"] = this.state.kitLotNo;
            submission["qcReconstituionDate"] = new Date(this.state.qcReconstituionDate).toISOString().split('T')[0];
            submission["testingDate"] = new Date(this.state.testingDate).toISOString().split('T')[0];
            submission["qcLotNumber"] = this.state.qcLotNumber;
            submission["qcNegativeIntepreation"] = this.state.qcNegativeIntepreation;
            submission["qcRecentIntepreation"] = this.state.qcRecentIntepreation;
            submission["qcLongtermIntepreation"] = this.state.qcLongtermIntepreation;
            submission["resultNegative"] = this.state.resultNegative;
            submission["resultRecent"] = this.state.resultRecent;
            submission["resultLongterm"] = this.state.resultLongterm;
            submission["nameOfTest"] = this.state.nameOfTest;
            submission["testerName"] = this.state.testerName;
            submission["isQCTested"] = this.state.isQcDone;
            submission["testJustification"] = this.state.testJustification;
            submission["qcNotTestedReason"] = !this.state.isQcDone ? this.state.notTestedReason : "";
            submission["qcNotTestedOtherReason"] = !this.state.isQcDone ? this.state.otherComments : "";
            submission["labId"] = this.state.labId;
            submission["userId"] = this.state.userId;
            submission["sampleType"] = this.state.sampleType;
            //repeats
            submission["qcNegativeIntepreationRepeat"] = this.state.qcNegativeIntepreationRepeat;
            submission["resultNegativeRepeat"] = this.state.resultNegativeRepeat;

            submission["resultRecentRepeat"] = this.state.resultRecentRepeat;
            submission["qcRecentIntepreationRepeat"] = this.state.qcRecentIntepreationRepeat;

            submission["resultLongtermRepeat"] = this.state.resultLongtermRepeat;
            submission["qcLongtermIntepreationRepeat"] = this.state.qcLongtermIntepreationRepeat;
            submission["formId"] = this.state.formId;

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

    qcInterpretationNegative(event, type, index) {
        if (type == 'repeat') {
            let qcNegativeIntepreationRepeat = this.state.qcNegativeIntepreationRepeat;
            qcNegativeIntepreationRepeat[index] = event.target.value;

            this.setState({
                qcNegativeIntepreationRepeat: qcNegativeIntepreationRepeat
            });

        } else {
            this.setState({
                qcNegativeIntepreation: event.target.value,
            });
        }

    }

    qcInterpretationRecent(event, type, index) {
        if (type == 'repeat') {
            let qcRecentIntepreationRepeat = this.state.qcRecentIntepreationRepeat;
            qcRecentIntepreationRepeat[index] = event.target.value;

            this.setState({
                qcRecentIntepreationRepeat: qcRecentIntepreationRepeat
            });

        } else {
            this.setState({
                qcRecentIntepreation: event.target.value
            });
        }

    }
    qcInterpretationLongterm(event, type, index) {
        if (type == 'repeat') {
            let qcLongtermIntepreationRepeat = this.state.qcLongtermIntepreationRepeat;
            qcLongtermIntepreationRepeat[index] = event.target.value;

            this.setState({
                qcLongtermIntepreationRepeat: qcLongtermIntepreationRepeat
            });

        } else {
            this.setState({
                qcLongtermIntepreation: event.target.value
            });
        }

    }
    repeatNegativeTest(event) {
        let repeats = this.state.negativeTestRepeats;
        let uuid4 = uuidv4();
        let repeatLen = repeats.length;
        let resultNegativeRepeat = this.state.resultNegativeRepeat;
        resultNegativeRepeat.push({ c: 0, v: 0, lt: 0 });

        let qcNegativeIntepreationRepeat = this.state.qcNegativeIntepreationRepeat;
        qcNegativeIntepreationRepeat.push('invalid');

        repeats.push(
            <NegativeKit key={uuid4}
                radioId={uuid4}
                isRepeat={true}
                // isShowNegativeRepeat={false}
                repeatNegativeTest={this.repeatNegativeTest}
                resultNegative={this.resultNegative}
                qcInterpretationNegative={this.qcInterpretationNegative}
                kitPositionInForm={repeatLen}
                deleteRepeatkit={this.deleteRepeatkit}
            />
        );

        this.setState({
            // isShowNegativeRepeat: !this.state.isShowNegativeRepeat,
            negativeTestRepeats: repeats,
            resultNegativeRepeat: resultNegativeRepeat,
            qcNegativeIntepreationRepeat: qcNegativeIntepreationRepeat

        });
    }

    repeatRecentTest(event) {

        let repeats = this.state.recentTestRepeats;
        let uuid4 = uuidv4();
        let repeatLen = repeats.length;
        let resultRecentRepeat = this.state.resultRecentRepeat;
        resultRecentRepeat.push({ c: 0, v: 0, lt: 0 });

        let qcRecentIntepreationRepeat = this.state.qcRecentIntepreationRepeat;
        qcRecentIntepreationRepeat.push('invalid');

        repeats.push(
            <RecentKit key={uuid4}
                radioId={uuid4}
                isRepeat={true}
                repeatRecentTest={this.repeatRecentTest}
                resultRecent={this.resultRecent}
                qcInterpretationRecent={this.qcInterpretationRecent}
                kitPositionInForm={repeatLen}
                deleteRepeatkit={this.deleteRepeatkit}
            />
        );

        this.setState({
            recentTestRepeats: repeats,
            resultRecentRepeat: resultRecentRepeat,
            qcRecentIntepreationRepeat: qcRecentIntepreationRepeat

        });
    }

    repeatLongtermTest(event) {

        let repeats = this.state.longtermTestRepeats;
        let uuid4 = uuidv4();
        let repeatLen = repeats.length;
        let resultLongtermRepeat = this.state.resultLongtermRepeat;
        resultLongtermRepeat.push({ c: 0, v: 0, lt: 0 });

        let qcLongtermIntepreationRepeat = this.state.qcLongtermIntepreationRepeat;
        qcLongtermIntepreationRepeat.push('invalid');

        repeats.push(
            <LongtermKit key={uuid4}
                radioId={uuid4}
                isRepeat={true}
                repeatLongtermTest={this.repeatLongtermTest}
                resultLongterm={this.resultLongterm}
                qcInterpretationLongterm={this.qcInterpretationLongterm}
                kitPositionInForm={repeatLen}
                deleteRepeatkit={this.deleteRepeatkit}
            />
        );

        this.setState({
            tongtermTestRepeats: repeats,
            resultLongtermRepeat: resultLongtermRepeat,
            qcLongtermIntepreationRepeat: qcLongtermIntepreationRepeat

        });
    }

    deleteRepeatkit(kitPositionInForm, type) {
        let repeats = [];
        let arrInterpretation = [];
        let arrResult = [];
        if (type == 'negative') {
            repeats = this.state.negativeTestRepeats;
            arrInterpretation = this.state.qcNegativeIntepreationRepeat;
            arrResult = this.state.resultNegativeRepeat;
        } else if (type == 'recent') {
            repeats = this.state.recentTestRepeats;
            arrInterpretation = this.state.qcRecentIntepreationRepeat;
            arrResult = this.state.resultRecentRepeat;
        } else if (type == 'longterm') {

            repeats = this.state.longtermTestRepeats;
            arrInterpretation = this.state.qcLongtermIntepreationRepeat;
            arrResult = this.state.resultLongtermRepeat;
        }

        arrInterpretation.splice(kitPositionInForm, 1, null);
        arrResult.splice(kitPositionInForm, 1, null);
        repeats.splice(kitPositionInForm, 1, null);

        if (type == 'negative') {
            this.setState({
                negativeTestRepeats: repeats,
                qcNegativeIntepreationRepeat: arrInterpretation,
                resultNegativeRepeat: arrResult
            });
        } else if (type == 'recent') {
            this.setState({
                recentTestRepeats: repeats,
                qcRecentIntepreationRepeat: arrInterpretation,
                resultRecentRepeat: arrResult
            });
        } else if (type == 'longterm') {
            this.setState({
                longtermTestRepeats: repeats,
                qcLongtermIntepreationRepeat: arrInterpretation,
                resultLongtermRepeat: arrResult
            });
        }

    }
    isRepeatsEmpty(type) {
        let repeats = [];
        if (type == 'negative') {
            repeats = this.state.negativeTestRepeats;

        } else if (type == 'recent') {
            repeats = this.state.recentTestRepeats;
        } else if (type == 'longterm') {
            repeats = this.state.longtermTestRepeats;
        }

        let hasValues = false;
        repeats.map((item) => {
            if (item) hasValues = true;
        });
        return hasValues
    }
    resultLongterm(event, type, index) {

        if (type == 'repeat') {
            let resultLongtermRepeat = this.state.resultLongtermRepeat;
            let result = resultLongtermRepeat[index];

            let reslt = event.target.checked ? 1 : 0;
            result[event.target.value] = reslt;
            resultLongtermRepeat[index] = result;

            this.setState({
                resultLongtermRepeat: resultLongtermRepeat
            });
        } else {
            let result = this.state.resultLongterm;

            let reslt = event.target.checked ? 1 : 0;
            result[event.target.value] = reslt;

            this.setState({
                resultLongterm: result
            });
        }
    }

    resultRecent(event, type, index) {

        if (type == 'repeat') {
            let resultRecentRepeat = this.state.resultRecentRepeat;
            let result = resultRecentRepeat[index];

            let reslt = event.target.checked ? 1 : 0;
            result[event.target.value] = reslt;
            resultRecentRepeat[index] = result;

            this.setState({
                resultRecentRepeat: resultRecentRepeat
            });
        } else {
            let result = this.state.resultRecent;
            let reslt = event.target.checked ? 1 : 0;
            result[event.target.value] = reslt;
            this.setState({
                resultRecent: result
            });
        }

    }

    resultNegative(event, type, index) {
        if (type == 'repeat') {

            let resultNegativeRepeat = this.state.resultNegativeRepeat;
            let result = resultNegativeRepeat[index];

            let reslt = event.target.checked ? 1 : 0;
            result[event.target.value] = reslt;
            resultNegativeRepeat[index] = result;

            this.setState({
                resultNegativeRepeat: resultNegativeRepeat
            });
        } else {
            let result = this.state.resultNegative;

            let reslt = event.target.checked ? 1 : 0;
            result[event.target.value] = reslt;

            this.setState({
                resultNegative: result
            });

        }

    }
    onQcLotReceiceDateHandler(date) {
        this.setState({
            qcLotReceivedDate: date
        });
    }

    onQcLotNumberHandler(event) {
        this.setState({
            qcLotNumber: event.target.value
        });
    }

    onTesternameChangeHandler(event) {
        this.setState({
            testerName: event.target.value
        });
    }

    onSampleTypeHandler(event) {
        this.setState({
            sampleType: event.target.value
        });
    }
    onTestJustificationHandler(event) {
        this.setState({
            testJustification: event.target.value
        });
    }

    onKitExpiryDateHandler(date) {
        this.setState({
            kitExpiryDate: date
        });
    }
    onKitReceivedDateHandler(date) {

        this.setState({
            kitReceivedDate: date
        });

    }
    onKitLotHandler(event) {
        this.setState({
            kitLotNo: event.target.value
        });
    }
    onTestingDateHandler(date) {
        this.setState({
            testingDate: date
        });
    }

    onNameOfTestHandler(event) {
        this.setState({
            nameOfTest: event.target.value
        });
    }

    onReconstitutionDateHandler(date) {

        this.setState({
            qcReconstituionDate: date
        });

    }

    validateTestingAndRecivedDate() {
        if (this.state.testingDate < this.state.testingDate.kitReceivedDate && (this.state.testingDate && this.state.testingDate.kitReceivedDate)) {
            this.setState({
                message: "QC lot Date received cannot be greater than testing date",
                // testingDate: '',
                // kitReceivedDate: ''
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    validateTestingDateAndCurrentDate() {

        let today = new Date();
        let testingDate = new Date(this.state.testingDate);
        if (testingDate > today) {
            this.setState({
                message: "Testing date cannot be greater than todays date",
                // testingDate: '',
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    validateTestingAndReconstituionDate() {
        if (this.state.testingDate < this.state.qcReconstituionDate && (this.state.qcReconstituionDate && this.state.testingDate)) {
            this.setState({
                message: "Kit testing Date cannot be less than reconstitution date",
                // testingDate: '',
                // qcReconstituionDate: ''
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    validateTestingAndQCLotRecivedDate() {
        if (this.state.testingDate < this.state.qcLotReceivedDate && (this.state.testingDate && this.state.qcLotReceivedDate)) {
            this.setState({
                message: "QC lot Date received cannot be greater than testing date",
                // testingDate: '',
                // qcLotReceivedDate: ''
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

        let isNegativeRepeatsEmpty = this.isRepeatsEmpty('negative');
        let negativeTestRepeats = [];
        if (this.state.negativeTestRepeats.length > 0) {
            this.state.negativeTestRepeats.map((repeat) => {
                negativeTestRepeats.push(repeat);
            });
        }

        let isRecentRepeatsEmpty = this.isRepeatsEmpty('recent');
        let recentTestRepeats = [];
        if (this.state.recentTestRepeats.length > 0) {
            this.state.recentTestRepeats.map((repeat) => {
                recentTestRepeats.push(repeat);
            });
        }

        let isLongtermRepeatsEmpty = this.isRepeatsEmpty('longterm');
        let longtermTestRepeats = [];
        if (this.state.longtermTestRepeats.length > 0) {
            this.state.longtermTestRepeats.map((repeat) => {
                longtermTestRepeats.push(repeat);
            });
        }

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
                                <strong><p>Submitter Name</p></strong>
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
                                <DatePicker dateFormat="dd/MM/yyyy"
                                    selected={this.state.testingDate}
                                    onChange={(date) => this.onTestingDateHandler(date)} />
                                {/* <input value={this.state.testingDate} onChange={() => this.onTestingDateHandler(event)} className="form-control" type="date" /> */}
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

                                <input value={this.state.nameOfTest} onChange={() => this.onNameOfTestHandler(event)} className="form-control" type="text" />
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>RTRI Kit Lot No. *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input value={this.state.kitLotNo} onChange={() => this.onKitLotHandler(event)} className="form-control" type="text" />
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
                                <DatePicker dateFormat="dd/MM/yyyy"
                                    selected={this.state.kitReceivedDate}
                                    onChange={(date) => this.onKitReceivedDateHandler(date)} />
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>RTRI Kit Expiry Date *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <DatePicker dateFormat="dd/MM/yyyy"
                                    selected={this.state.kitExpiryDate}
                                    onChange={(date) => this.onKitExpiryDateHandler(date)} />

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

                                <input value={this.state.qcLotNumber} onChange={() => this.onQcLotNumberHandler(event)} className="form-control" type="text" />
                            </div>

                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>QC Lot Date Received *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <DatePicker dateFormat="dd/MM/yyyy"
                                    selected={this.state.qcLotReceivedDate}
                                    onChange={(date) => this.onQcLotReceiceDateHandler(date)} />
                            </div>

                        </div>

                        <div className="row">
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Date QC Samples Reconstituted:</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <DatePicker dateFormat="dd/MM/yyyy"
                                    selected={this.state.qcReconstituionDate}
                                    onChange={(date) => this.onReconstitutionDateHandler(date)} />
                            </div>

                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Tester name: *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <input value={this.state.testerName} onChange={() => this.onTesternameChangeHandler(event)} className="form-control" type="text" />
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
                                    <option>New kit lot/batch</option>
                                    <option>Change in environmental conditions</option>
                                </select>
                            </div>
                            {/* sample type */}
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Sample type:</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <select
                                    value={this.state.sampleType} onChange={() => this.onSampleTypeHandler(event)}
                                    className="custom-select" aria-label="Default select example">
                                    <option selected>DTS</option>
                                    <option>Plasma</option>
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
                                        <LongtermKit
                                            resultLongterm={this.resultLongterm}
                                            qcInterpretationLongterm={this.qcInterpretationLongterm}
                                            repeatLongtermTest={this.repeatLongtermTest}
                                            isMainKit={true}
                                            kitPositionInForm={0}
                                            isReaptsEmpty={isLongtermRepeatsEmpty}
                                            isEdit={this.props.isEdit}
                                            resultLongtermEditResults={this.state.resultLongterm}
                                            qcLongtermIntepreationEditResults={this.state.qcLongtermIntepreation}

                                        />
                                        {longtermTestRepeats}

                                        {/*  End QC - Long Term */}


                                        {/*  QC - Recent */}
                                        <RecentKit
                                            repeatRecentTest={this.repeatRecentTest}
                                            resultRecent={this.resultRecent}
                                            qcInterpretationRecent={this.qcInterpretationRecent}
                                            isMainKit={true}
                                            kitPositionInForm={0}
                                            isReaptsEmpty={isRecentRepeatsEmpty}
                                            isEdit={this.props.isEdit}
                                            resultRecentEditResults={this.state.resultRecent}
                                            qcRecentIntepreationEditResults={this.state.qcRecentIntepreation}
                                        />
                                        {recentTestRepeats}

                                        {/*  End QC - Long Recent */}

                                        {/*  QC - Negative */}
                                        <NegativeKit
                                            repeatNegativeTest={this.repeatNegativeTest}
                                            resultNegative={this.resultNegative}
                                            qcInterpretationNegative={this.qcInterpretationNegative}
                                            isMainKit={true}
                                            kitPositionInForm={0}
                                            isReaptsEmpty={isNegativeRepeatsEmpty}
                                            isEdit={this.props.isEdit}
                                            resultNegativeEditResults={this.state.resultNegative}
                                            qcNegativeIntepreationEditResults={this.state.qcNegativeIntepreation}
                                        />

                                        {negativeTestRepeats}

                                    </tbody>
                                </table>
                            </div>

                        </div>

                        {/* End QC Test results fields */}
                        <hr />

                    </div>
                    <div className="d-flex w-100 justify-content-center">

                        <button type="button " onClick={() => this.submitForm()} className="btn btn-info float-left mx-2">
                            {this.props.isEdit ? 'Update' : 'Submit'}
                        </button>

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

import React from 'react';
import StatsLabel from '../../../components/utils/stats/StatsLabel';
import { SaveFcdrrSubmission, FetchCurrentParticipantDemographics, FetchFcdrrSubmission } from '../../../components/utils/Helpers';
import './Results.css';
import { v4 as uuidv4 } from 'uuid';
import './fcdrr.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class FcdrrTool extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            labId: '',
            userId: '',
            labName: '',
            countyName: '',
            mflCode: '',
            userDemographics: [],
            edittableSubmission: {},
            testerName: '',
            reportDate: new Date(),
            rowsNumbers: 50,
            submissionId: null,
            dataRows: []
        }
    }

    componentDidMount() {

        (async () => {
            let edittableSubmission = null;
            let userDemographics = null;

            if (this.props.isEdit) {
                edittableSubmission = await FetchFcdrrSubmission(this.props.editId);
                this.setState({
                    labId: edittableSubmission['data']['lab_id'],
                    userId: edittableSubmission['data']['user_id'],
                    labName: edittableSubmission['data']['lab_name'],
                    countyName: edittableSubmission['data']['county'],
                    mflCode: edittableSubmission['data']['mfl'],
                    reportDate: new Date(edittableSubmission['data']['report_date']),
                    edittableSubmission: edittableSubmission,
                    userDemographics: userDemographics,
                    submissionId: this.props.editId
                });
            } else {



                userDemographics = await FetchCurrentParticipantDemographics();
                this.setState({
                    userDemographics: userDemographics,
                    labId: userDemographics[0].lab_id,
                    userId: userDemographics[0].user_id,
                    labName: userDemographics[0].lab_name,
                    countyName: userDemographics[0].county,
                    mflCode: userDemographics[0].mfl_code,
                    edittableSubmission: edittableSubmission,
                });
            }
        })();
    }

    componentDidUpdate(prevProps) {

    }

    submitForm() {

        let count;
        let elementsLength = 14;
        let formData = [];
        for (count = 0; count < this.state.rowsNumbers; count++) {
            let refName = 'formData' + count;
            let element = this.refs[refName];
            let rowRawData = [];

            for (let i = 1; i < element.children.length; i++) {
                try {
                    if (element.children[i].children[0].value) {
                        rowRawData.push(element.children[i].children[0].value);
                    }

                } catch (err) {

                }
            }

            if (rowRawData.length != elementsLength && rowRawData.length > 1) { //check if row has data
                $('#returnedMessage').text("Kindly fill all elements in row " + (count + 1));
                $('#messageModal').modal('toggle');
                return;
            }
            if (rowRawData.length > 1) {
                formData.push(rowRawData);
            }

        }

        if (formData.length == 0) {
            $('#returnedMessage').text("Form is empty, kindly fill it ");
            $('#messageModal').modal('toggle');
            return;
        }
        let dateStart = (this.state.reportDate.getUTCFullYear()) + "/" + (this.state.reportDate.getMonth() + 1) + "/" + (this.state.reportDate.getUTCDate());;
        // let dateEnd = (this.state.reportDate.getUTCFullYear()) + "/" + (this.state.reportDate.getMonth() + 1) + "/" + (this.state.reportDate.getUTCDate());;

        let payload = {
            metadata: {
                'id': this.state.submissionId,
                'user_id': this.state.userId,
                'lab_id': this.state.labId,
                'report_date': dateStart,
            },
            'forData': formData
        };

        (async () => {
            let response = await SaveFcdrrSubmission(payload);
            this.setState({
                message: response.data.Message,
            });
            $('#messageModal').modal('toggle');
            if (response.status == 200) {
                this.props.toggleView();
            }
        })();

    }

    render() {
        let editRows = [];

        if (this.state.edittableSubmission && this.state.edittableSubmission['results']) {
            this.state.edittableSubmission['results'].map((value, index) => {
                editRows.push(

                    <tr key={uuidv4()} ref={`formData${index}`}>
                        <td>{index + 1}</td>
                        <td><input type="text" defaultValue={value['comodity_name']} /></td>
                        <td><input className="width120px" defaultValue={value['unit_of_issue']} type="text" /></td>
                        <td><input className="width120px" defaultValue={value['beggining_balance']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['qnty_received_kemsa']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['qnty_received_other_sources']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['qnty_used']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['no_of_tests_done']} type="number" /></td>
                        <td></td>
                        <td><input className="width120px" defaultValue={value['losses_damages']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['losses_errors']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['adjustments_positive']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['adjustments_negative']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['end_of_month_stock']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['days_out_of_stock']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['qnty_requested_resupply']} type="number" /></td>
                    </tr>
                )
            });
            let additionalRows = 50 - editRows.length;
            let currentRowLen = editRows.length;
            if (additionalRows > 0) {
                Array(additionalRows).fill(null).map((value, index) => {
                    editRows.push(<tr key={uuidv4()} ref={`formData${index + currentRowLen}`}>
                        <td>{index + currentRowLen + 1}</td>
                        <td><input type="text" /></td>
                        <td><input className="width120px" type="text" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                    </tr>);
                })
            }

        } else {

            if (this.state.dataRows.length == 0) {
                let dataRows = [];
                Array(50).fill(null).map((value, index) => {
                    dataRows.push(<tr key={uuidv4()} ref={`formData${index}`}>
                        <td>{index + 1}</td>
                        <td><input type="text" /></td>
                        <td><input className="width120px" type="text" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                    </tr>);
                });
                this.setState({
                    dataRows: dataRows
                });
            }
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

        let today = new Date().toLocaleDateString();

        $("document").ready(function () {
            $(".scroll1 div").width($("#select").width());

            $(".scroll1").on("scroll", function () {
                $(".scroll2").scrollLeft($(this).scrollLeft());
            });

            $(".scroll2").on("scroll", function () {
                $(".scroll1").scrollLeft($(this).scrollLeft());
            });
        });
        let data = '';
        return (
            <>
                <div className="row">
                    <div className="col-sm-12 text-left">

                        {
                            this.props.isAdmin ?
                                <div className="row">
                                    <div className="col-sm-10">
                                        <h4 className="float-left">
                                            CONSUMPTION DATA REPORT & REQUEST FOR ASANTE™ HIV-1 RAPID RECENCY® TEST KITS
                                        </h4>
                                    </div>
                                    <div className="col-sm-2">
                                        <button className="float-right" type="button"
                                            onClick={
                                                () => {
                                                    window.location.assign('/fcdrr-report')
                                                }
                                            } className="btn btn-primary float-left mx-2">
                                            <i class="fas fa-arrow-left"></i> Back
                                        </button>
                                    </div>

                                </div>
                                :
                                <>
                                    <h4>CONSUMPTION DATA REPORT & REQUEST FOR ASANTE™ HIV-1 RAPID RECENCY® TEST KITS</h4>
                                    <hr />
                                </>
                        }
                        <br />
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <table className="unstrip no-table-border">
                        <tbody>
                            <tr className="alignTdChildLeft">
                                <td><strong>Name of tesing facility:</strong> <u>{this.state.labName}</u></td>
                                <td><strong>Facility MFL Code:</strong> <u>{this.state.mflCode}</u></td>
                                <td><strong>County:</strong>  <u>{this.state.countyName}</u></td>
                            </tr>
                            <tr className="alignTdChildLeft">
                                <td><strong>Report for month: </strong>
                                    {/* <input type="month" /> */}
                                    <DatePicker
                                        dateFormat="yyyy/MM"
                                        selected={this.state.reportDate} onChange={(date) => {
                                            this.setState({
                                                reportDate: date
                                            })
                                        }} />
                                </td>
                                <td><strong>Ending month: </strong>
                                    <DatePicker
                                        dateFormat="yyyy/MM"
                                        selected={this.state.reportDate} onChange={(date) => {
                                            this.setState({
                                                reportDate: date
                                            })
                                        }} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br />

                {/* style="overflow-x: auto;"
                 */}

                <div className="scroll1" style={{ "overflowX": "auto", "marginLeft": "-7.5px", "marginRight": "-7.5px" }}>
                    <div style={{ "height": "15px", "marginBottom": "3px" }}></div>
                </div>

                <div style={{ "overflowX": "auto" }} className="row scroll2">
                    <table id="select" className="unstrip">
                        <tbody>
                            <tr className="boldTdChildText">
                                <td rowSpan={2}>#</td>
                                <td rowSpan={2}>Commodity <br /> Name</td>
                                <td rowSpan={2}>Unit <br /> of issue/<br />Pack size</td>
                                <td rowSpan={2}>Beginning <br /> balance</td>
                                <td colSpan={4}>Quantity used</td>
                                {/* losses and wastages */}
                                <td rowSpan={2}></td>
                                <td colSpan={2}>Losses and Wastage</td>
                                <td colSpan={2}>Adjustments </td>
                                <td rowSpan={2}>End of Month (Physical Stock Count)  </td>
                                <td rowSpan={2}> Days out of Stock this month  </td>
                                <td rowSpan={2}>Quantity Requested for Re-supply  </td>
                            </tr>

                            <tr className="boldTdChildText">
                                <td>Quantity received<br /> from central<br /> stores this month</td>
                                <td> Quantity received <br />  from other <br />  sources (e.g. local suppliers)</td>
                                <td>Quantity used</td>
                                <td>Number of<br /> Tests done <br />(include repeats, QA/QC)</td>
                                <td>Losses (damages, expiries & unaccounted for) </td>
                                <td>Losses (errors, invalid & undetermined) </td>
                                <td>Positive</td>
                                <td>Negative</td>
                            </tr>
                            {

                                this.props.isEdit ?
                                    editRows
                                    :
                                    this.state.dataRows
                            }
                        </tbody>
                    </table>
                </div>
                <br />
                <div className="row">
                    <div className="d-flex w-100 justify-content-center">
                        {
                            this.props.isAdmin ?
                                ''
                                :
                                this.props.isEdit ?
                                    <button type="button " onClick={() => this.submitForm()} className="btn btn-info float-left mx-2">Update</button> :
                                    <button type="button " onClick={() => this.submitForm()} className="btn btn-info float-left mx-2">Submit</button>
                        }
                        {
                            this.props.isAdmin ?
                                <button type="button"
                                    onClick={
                                        () => {
                                            window.location.assign('/fcdrr-report')
                                        }
                                    } className="btn btn-danger float-left mx-2">Exit
                                </button>
                                :
                                <button type="button" onClick={() => {
                                    this.props.toggleView();
                                }} className="btn btn-danger float-left mx-2">Cancel
                                </button>
                        }

                    </div>
                </div>
                <br />
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

export default FcdrrTool;

import React from 'react';
import StatsLabel from '../../../components/utils/stats/StatsLabel';
import { SaveSubmission, FetchCurrentParticipantDemographics, FetchSubmission } from '../../../components/utils/Helpers';
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
            startDate: new Date(),
            endDate: new Date(),
        }
    }

    componentDidMount() {

        (async () => {
            let edittableSubmission = null;
            let userDemographics = await FetchCurrentParticipantDemographics();
            edittableSubmission = await FetchSubmission(this.props.editId);
            if (this.props.isEdit) {
                this.setState({
                    labId: edittableSubmission['data']['lab_id'],
                    userId: edittableSubmission['data']['user_id'],
                    labName: edittableSubmission['data']['lab_name'],
                    countyName: edittableSubmission['data']['county'],
                    mflCode: edittableSubmission['data']['mfl'],
                    userDemographics: userDemographics,
                });
            } else {
                this.setState({
                    userDemographics: userDemographics,
                    labId: userDemographics[0].lab_id,
                    userId: userDemographics[0].user_id,
                    labName: userDemographics[0].lab_name,
                    countyName: userDemographics[0].county,
                    mflCode: userDemographics[0].mfl_code,
                    edittableSubmission: edittableSubmission
                });
            }
        })();
    }

    componentDidUpdate(prevProps) {

    }

    submitForm() {

        let element = this.refs.formData;
        console.log(element.children.length)
        for (let i = 0; i < element.children.length; i++) {
            console.log(element.children[i].innerHTML);
        }

        if (
            false
        ) {
            this.setState({
                message: "Fill in all the fields marked *"
            })
            $('#messageModal').modal('toggle');
        } else {
            let submission = {};

            (async () => {
                // let response = await SaveSubmission(submission);
                // this.setState({
                //     message: response.data.Message,
                // });
                // $('#messageModal').modal('toggle');
                // if (response.status == 200) {
                this.props.toggleView();
                // }
            })();
        }
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
                        <h4>CONSUMPTION DATA REPORT & REQUEST FOR ASANTE™ HIV-1 RAPID RECENCY® TEST KITS</h4>
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
                                        selected={this.state.startDate} onChange={(date) => {
                                            this.setState({
                                                startDate: date
                                            })
                                        }} />
                                </td>
                                <td><strong>Ending month: </strong>
                                    <DatePicker
                                        dateFormat="yyyy/MM"
                                        selected={this.state.endDate} onChange={(date) => {
                                            this.setState({
                                                endDate: date
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
                                <td rowSpan={2}>Commodity <br /> Name</td>
                                <td rowSpan={2}>Unit <br /> of issue</td>
                                <td rowSpan={2}>Beggining <br /> balance</td>
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
                                <td>Quantity received  <br /> this month  <br /> from KEMSA</td>
                                <td> Quantity received <br />  from other <br />  sources (e.g. local suppliers)</td>
                                <td>Quantity used</td>
                                <td>Number of<br /> Tests done <br />(include repeats, QA/QC)</td>
                                <td>Losses (damages, expiries & unaccounted for) </td>
                                <td>Losses (errors, invalid & undetermined) </td>
                                <td>Positive</td>
                                <td>Negative</td>
                            </tr>
                            {
                                Array(5).fill(null).map((value, index) => (
                                    <tr key={uuidv4()} ref="formData">
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
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <br />
                <div className="row">
                    <div className="d-flex w-100 justify-content-center">

                        <button type="button " onClick={() => this.submitForm()} className="btn btn-info float-left mx-2">Submit</button>
                        <button type="button" onClick={() => {
                            this.props.toggleView();
                        }} className="btn btn-danger float-left mx-2">Cancel</button>
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

import React from 'react';
import StatsLabel from '../../../components/utils/stats/StatsLabel';
import { SaveSubmission, FetchCurrentParticipantDemographics, FetchSubmission } from '../../../components/utils/Helpers';
import './Results.css';
import { v4 as uuidv4 } from 'uuid';
import './fcdrr.css';

class FcdrrTool extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            labId: '',
            userId: '',
            userDemographics: [],
            edittableSubmission: {},
            testerName: ''
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
                    userDemographics: userDemographics,
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

        return (
            <>
                <div className="row">
                    <div className="col-sm-12 text-center">
                        <h3>CONSUMPTION DATA REPORT & REQUEST FOR ASANTE™ HIV-1 RAPID RECENCY® TEST KITS</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <table className="unstrip no-table-border">
                        <tbody>
                            <tr className="alignTdChildLeft">
                                <td>Name of tesing facility: ___________</td>
                                <td>Facility MFL Code: ___________</td>
                                <td>County: ___________</td>
                            </tr>
                            <tr className="alignTdChildLeft">
                                <td>Report for month: ___________</td>
                                <td>Ending month: ___________</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br />
                <div className="row">
                    <table className="unstrip">
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
                                <td> Quantity received <br />  from other <br />  sources (e.g. local suppliers) </td>
                                <td>Quantity used</td>
                                <td>Number of<br /> Tests done <br />(include repeats, QA/QC)</td>
                                <td>Losses (damages, expiries & unaccounted for) </td>
                                <td>Losses (errors, invalid & undetermined) </td>
                                <td>Positive</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="row">
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

export default FcdrrTool;

import React from 'react';
import StatsLabel from '../../../components/utils/stats/StatsLabel';
import { SaveFcdrrSubmission, FetchCurrentParticipantDemographics, FetchFcdrrSubmission, getAllCommodities } from '../../../components/utils/Helpers';
import './Results.css';
import { v4 as uuidv4 } from 'uuid';
import './fcdrr.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CreatableSelect from 'react-select/creatable';

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
            rowsNumbers: 0,
            submissionId: null,
            dataRows: [],
            all_commodities: [],
            commodities: [],
            select_styles: {},
        }
    }

    componentDidMount() {

        (async () => {

            // fetch all commodities
            try {
                let al_c = await getAllCommodities();
                if (al_c.status == 200) {
                    this.setState({
                        all_commodities: al_c.data
                    });

                    ////////////////////////
                    ////////////////////////
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
                            commodities: JSON.parse(edittableSubmission['data']['commodities']),
                            reportDate: new Date(edittableSubmission['data']['report_date']),
                            edittableSubmission: edittableSubmission,
                            userDemographics: userDemographics,
                            submissionId: this.props.editId,
                            rowsNumbers: edittableSubmission['data']['commodities'] ? JSON.parse(edittableSubmission['data']['commodities']).length : 0
                        });
                    } else {

                        let reportDate = new Date();
                        let currDay = 30;
                        let currYear = reportDate.getUTCFullYear();
                        let currYMonth = reportDate.getUTCMonth()// + 1
                        let dt = currYear + "-" + (parseInt(currYMonth) < 10 ? '0' + currYMonth : currYMonth) + "-" + currDay;
                        reportDate = new Date(currYear, currYMonth, currDay);
                        // reportDate.setMonth(reportDate.getMonth() - 1);

                        userDemographics = await FetchCurrentParticipantDemographics();
                        let lab_comm_ids = JSON.parse(userDemographics[0]['commodities']);
                        this.setState({
                            userDemographics: userDemographics,
                            labId: userDemographics[0].lab_id,
                            userId: userDemographics[0].user_id,
                            labName: userDemographics[0].lab_name,
                            countyName: userDemographics[0].county,
                            mflCode: userDemographics[0].mfl_code,
                            reportDate: reportDate,
                            edittableSubmission: edittableSubmission,
                            commodities: Array.from(this.state.all_commodities, (x) => {
                                return lab_comm_ids.includes(x.id) ? x : null;
                            }).filter(x => x != null),
                            rowsNumbers: lab_comm_ids.length,
                        });
                    }
                    ////////////////////////
                    ////////////////////////
                } else {
                    console.log('error fetching all commodities');
                    this.setState({
                        all_commodities: [],
                        message: 'Error fetching all commodities'
                    });
                    $('#returnedMessage').text("error fetching all commodities");
                    $('#messageModal').modal('toggle');
                }
            } catch (error) {
                console.log(error);
            }
        })();

        this.setState({
            select_styles: {
                control: styles => ({ ...styles, backgroundColor: 'white', fontSize: '14px', padding: '0px' }),
                option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                  return {
                    ...styles,
                    fontSize: '13px',
                    padding: '2px',
                    margin: '0px 0px',
                  };
                },
              }
        });
              
    }

    componentDidUpdate(prevProps) {

    }

    handleChange(newValue, actionMeta) {
        {
            console.group('Value Changed');
            console.log(newValue);
            console.log(`action: ${actionMeta.action}`);
            console.groupEnd();
        };
    }
    handleInputChange(inputValue, actionMeta) {
        console.group('Input Changed');
        console.log(inputValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
    }

    submitForm() {

        let count;
        let elementsLength = 15;
        let formData = [];
        for (count = 0; count < this.state.rowsNumbers; count++) {
            let refName = 'formData' + count;
            let element = this.refs[refName];
            let rowRawData = [];

            for (let i = 1; i < element.children.length; i++) {
                // console.log('element '+i+1+':', element.children[i].children[0].value || element.children[i].children[1].value || element.children[i].children[2].value);
                try {
                    if (element.children[i].children[0].value) {
                        rowRawData.push(element.children[i].children[0].value);
                    }

                } catch (err) {

                }
            }

            if (rowRawData.length != elementsLength && rowRawData.length > 1) { //check if row has data
                $('#returnedMessage').text("Kindly fill all elements in row " + (count + 1));
                console.log("rowRawData.length:", rowRawData.length)
                console.log("elementsLength:", elementsLength)
                console.log("rowRawData:", rowRawData)
                console.log("elements:", elementsLength)
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
                        <td><input readOnly={true} type="text" defaultValue={value['commodity_name']} /></td>
                        <td><input readOnly={true} defaultValue={value['unit_of_issue']} type="text" /></td>
                        <td><input className="width120px" defaultValue={value['beggining_balance']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['qnty_received_kemsa']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['qnty_received_other_sources']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['qnty_used']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['no_of_tests_done']} type="number" /></td>
                        <td></td>
                        <td><input className="width120px" defaultValue={value['losses_damages']} type="number" /></td>
                        {/* <td><input className="width120px" defaultValue={value['losses_errors']} type="number" /></td> */}
                        <td style={{minWidth: '240px'}}>
                            {/* <textarea style={{width: '240px'}} defaultValue={value['losses_comments']} rows={2} /> */}
                            <input type="hidden" defaultValue={value['losses_comments']} id={"edit_lc__"+index} />
                            <div style={{minWidth: '240px'}}>
                                <CreatableSelect
                                    isClearable
                                    onChange={(newValue, actionMeta) => {
                                        document.getElementById(`edit_lc__${index}`).value = newValue.value;
                                    }}
                                    defaultValue={{value: value['losses_comments'], label: value['losses_comments']}}
                                    styles={this.state.select_styles}
                                    options={[
                                        { value: 'Damages', label: 'Damages' },
                                        { value: 'Expiries', label: 'Expiries' },
                                        { value: 'Unaccounted', label: 'Unaccounted for' },
                                    ]}
                                />
                            </div>
                        </td>
                        <td><input className="width120px" defaultValue={value['adjustments_positive']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['adjustments_negative']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['end_of_month_stock']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['days_out_of_stock']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['qnty_requested_resupply']} type="number" /></td>
                        <td><input className="width120px" defaultValue={value['qnty_expiry_six_months']} type="number" /></td>
                    </tr>
                )
            });
            let currentRowLen = editRows.length;
            if (this.state.all_commodities && this.state.all_commodities.length > 0 && this.state.commodities && this.state.commodities.length > 0 && this.state.commodities.length > currentRowLen) {
                this.state.commodities.filter(cdt =>
                    !Array.from(
                        this.state.edittableSubmission["results"], e =>
                        this.state.all_commodities.find(c => c.commodity_name == e.commodity_name).id
                    ).includes(cdt)
                ).map((cm, cx) => {
                    let { commodity_name, unit_of_issue } = this.state.all_commodities.find(w => w.id == cm) || {};
                    editRows.push(<tr key={uuidv4()} ref={`formData${cx + currentRowLen}`}>
                        <td>{cx + currentRowLen + 1}</td>
                        <td><input type="text" defaultValue={commodity_name} readOnly={true} /></td>
                        <td><input type="text" defaultValue={unit_of_issue} readOnly={true} /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td></td>
                        <td><input className="width120px" type="number" /></td>
                        {/* <td><input className="width120px" type="number" /></td> */}
                        <td style={{minWidth: '240px'}}>
                            <input type="hidden" id={"losscomm__"+cx} />
                            <div style={{minWidth: '240px'}}>
                                <CreatableSelect
                                    isClearable
                                    onChange={(newValue, actionMeta) => {
                                        document.getElementById(`losscomm__${cx}`).value = newValue.value;
                                    }}
                                    styles={this.state.select_styles}
                                    options={[
                                        { value: 'Damages', label: 'Damages' },
                                        { value: 'Expiries', label: 'Expiries' },
                                        { value: 'Unaccounted', label: 'Unaccounted for' },
                                    ]}
                                />
                            </div>
                        </td>
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
            console.log('New submission');
            if (this.state.dataRows.length == 0 && this.state.commodities.length > 0) {
                let dataRows = [];
                this.state.commodities.map((cm, cx) => {
                    dataRows.push(<tr key={uuidv4()} ref={`formData${cx}`}>
                        <td>{cx + 1}</td>
                        <td><input type="text" defaultValue={cm.commodity_name} readOnly={true} /></td>
                        {/* <td><input type="text" /></td> */}
                        <td><input type="text" defaultValue={cm.unit_of_issue} readOnly={true} /></td>
                        {/* <td><input className="width120px" type="text" /></td> */}
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td><input className="width120px" type="number" /></td>
                        <td></td>
                        <td><input className="width120px" type="number" /></td>
                        {/* <td><input className="width120px" type="number" /></td> */}
                        <td style={{minWidth: '240px'}}>
                            {/* <textarea style={{width: '240px'}} rows={2} /> */}
                            <input type="hidden" id={"nw_lc__"+cx} />
                            <div style={{minWidth: '240px'}}>
                                <CreatableSelect
                                    isClearable
                                    onChange={(newValue, actionMeta) => {
                                        document.getElementById(`nw_lc__${cx}`).value = newValue.value;
                                    }}
                                    styles={this.state.select_styles}
                                    options={[
                                        { value: 'Damages', label: 'Damages' },
                                        { value: 'Expiries', label: 'Expiries' },
                                        { value: 'Unaccounted', label: 'Unaccounted for' },
                                    ]}
                                />
                            </div>
                        </td>
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
            } else {
                console.log('commodities error:', 'None assigned to this lab');
                // console.log('this.state.commodities ', this.state.commodities)
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
                                        <a href='/fcdrr-submissions' className="btn btn-primary float-right mx-2">
                                            <i class="fas fa-arrow-left"></i> Back
                                        </a>
                                    </div>

                                </div>
                                :
                                <>
                                    <div className="row">
                                        <div className="col-sm-10">
                                            <h4 className="float-left">
                                                CONSUMPTION DATA REPORT & REQUEST FOR ASANTE™ HIV-1 RAPID RECENCY® TEST KITS
                                            </h4>
                                        </div>
                                        <div className="col-sm-2">
                                            <a className='btn btn-light btn-sm float-right' href="/fcdrr-report">&larr; Go back</a>
                                        </div>
                                        <hr />
                                        <div className='col-md-12'>
                                            {
                                                this.props.isEdit && !this.props.canUpdate ?
                                                    <p style={{ "backgroundColor": "red" }}>
                                                        Alter not allowed as date is past reporting period
                                                    </p>
                                                    :
                                                    ''
                                            }
                                        </div>
                                    </div>
                                </>
                        }
                        <br />
                        <hr />
                    </div>
                </div>
                <div className="row">
                    {/* <div className='col-md-12'>
                        {JSON.stringify(this.state.commodities,null,2)}
                    </div> */}
                    <table className="unstrip no-table-border">
                        <tbody>
                            <tr className="alignTdChildLeft">
                                <td><strong>Name of tesing facility:</strong> <u>{this.state.labName}</u></td>
                                <td><strong>Facility MFL Code:</strong> <u>{this.state.mflCode}</u></td>
                                <td><strong>County:</strong>  <u>{this.state.countyName}</u></td>
                            </tr>
                            <tr className="alignTdChildLeft">
                                <td colSpan={2} className="text-center">
                                    <strong>Report for month: </strong>
                                    {/* <input type="month" /> */}
                                    <DatePicker
                                        dateFormat="yyyy/MM"
                                        selected={this.state.reportDate}
                                        onChange={(date) => {
                                            // console.log('currdate', this.state.reportDate)
                                            // console.log('newdate', date)
                                            this.setState({
                                                reportDate: date
                                            })
                                        }}
                                        maxDate={new Date()}
                                    />
                                </td>
                                {/* <td>
                                    <strong>Ending month: </strong>
                                    <DatePicker
                                        dateFormat="yyyy/MM"
                                        selected={this.state.reportDate}
                                    // onChange={(date) => {
                                    //     this.setState({
                                    //         reportDate: date
                                    //     })
                                    // }} 
                                    />
                                </td> */}
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

                <div style={{ "overflowX": "auto", padding: '1.4em 0' }} className="row scroll2">
                    <table id="select" className="unstrip" style={{marginBottom: '3em'}}>
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
                                <td rowSpan={2}>Quantity expiring in 6 months  </td>
                            </tr>

                            <tr className="boldTdChildText">
                                <td>Quantity received<br /> from central<br /> stores this month</td>
                                <td> Quantity received <br />  from other <br />  sources (e.g. local suppliers)</td>
                                <td>Quantity used (including errors, invalid)</td>
                                <td>Number of<br /> Tests done <br />(include repeats, QA/QC)</td>
                                <td>Losses (damages, expiries & unaccounted for) </td>
                                {/* <td>Losses (errors, invalid & undetermined) </td> */}
                                <td style={{width: '300px'}}>Losses reasons (Comments) </td>
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
                                    this.props.canUpdate ?
                                        <button type="button " onClick={() => this.submitForm()} className="btn btn-info float-left mx-2">Update</button>
                                        :
                                        ''
                                    :
                                    <button type="button " onClick={() => this.submitForm()} className="btn btn-info float-left mx-2">Save changes and exit</button>
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

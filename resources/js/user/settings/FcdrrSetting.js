import React from 'react';
import ReactDOM from 'react-dom';
import FcdrrTool from '../qc/participant/FcdrrTool';
import { SaveFcdrrSetting, GetAllFcdrrSettings, saveCommodity, getAllCommodities, deleteCommodityById } from '../../components/utils/Helpers';

class FcdrrSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            windowPeriod: 0,
            newState: 0,
            newCommodity: {
                commodity_name: "",
                unit_of_issue: "",
                manufacturer: ""
            },
            commodities: [],
        }
        this.windowPeriodhandler = this.windowPeriodhandler.bind(this);
    }

    componentDidMount() {


        (async () => {

            // settings
            let response = await GetAllFcdrrSettings();
            let windowPeriod = 5;
            if (response.status == 500) {
                this.setState({
                    message: response.data.Message || response.Message || 'Error getting settings',
                });
                $('#settingModal').modal('toggle');
            } else {
                response.map((setting) => {
                    if (setting.name == 'window_period') {
                        windowPeriod = setting.value
                    }
                })
                this.setState({
                    windowPeriod: windowPeriod,
                })
            }

            // commodities
            let commodities = await getAllCommodities();
            if (commodities.status == 500) {
                this.setState({
                    message: commodities.data.Message || response.Message || 'Error getting commodities',
                });
                $('#settingModal').modal('toggle');
            } else {
                // console.log('--commodities: ', commodities);
                this.setState({
                    commodities: commodities.data,
                })
            }

        })();
    }


    editCommodity(id) {
        let commodity = this.state.commodities.find(c => c.id == id);
        console.log('--commodity: ', this.state.newCommodity);
        this.setState({
            newCommodity: {
                ...commodity
            },
        })
    }



    deleteCommodity(id) {
        (async () => {
            if (window && window.confirm("Are you sure you want to delete this commodity?")) {
                let response = await deleteCommodityById(id);
                this.setState({
                    message: response?.data?.Message || response?.message || 'Deleted successfully'
                })
                $('#messageModal').modal('toggle');
            } else if (!window || !window.confirm || window == undefined) {
                let response = await deleteCommodityById(id);
                this.setState({
                    message: response?.data?.Message || response?.message || 'Deleted successfully'
                })
                $('#messageModal').modal('toggle');
            }
        })();

        setTimeout(() => {
            if (window && window != undefined && window.location) {
                window.location.reload();
            }
        }, 3000);
    }

    addCommodity() {
        let newCommodity = this.state.newCommodity;
        if (newCommodity.commodity_name == null || newCommodity.commodity_name == "" || newCommodity.unit_of_issue == null || newCommodity.unit_of_issue == "" || newCommodity.manufacturer == null || newCommodity.manufacturer == "") {
            // alert('Please fill all the fields');
            this.setState({
                message: 'Please fill all the fields'
            })
            $('#settingModal').modal('toggle');
            return;
        }
        (async () => {
            let response = await saveCommodity(newCommodity);
            if (response.status == 200) {
                this.setState({
                    message: response?.data?.Message || response?.message || response?.message || 'Commodity saved successfully',
                    newCommodity: {
                        commodity_name: null,
                        unit_of_issue: null,
                        manufacturer: null
                    }
                });
                $('#settingModal').modal('toggle');

                setTimeout(() => {
                    if (window && window != undefined && window.location) {
                        window.location.reload();
                    }
                }, 3000);
            } else {
                console.error(response);
                this.setState({
                    message: response?.data?.Message || response?.message || response?.message || 'Error saving commodity',
                });
                $('#settingModal').modal('toggle');
            }
        })();
    }

    windowPeriodhandler(value, name) {
        this.setState({
            windowPeriod: value,
        });

        (async () => {

            let response = await SaveFcdrrSetting(value, name);

            if (response.status == 500) {
                console.error(response);
                this.setState({
                    message: response?.data?.Message || response?.Message || response?.message || 'Error saving settings',
                });
                $('#settingModal').modal('toggle');
            } else {
                this.setState({
                    message: response?.data?.Message || response?.Message || response?.message || 'Settings saved successfully',
                });
                $('#settingModal').modal('toggle');
            }

            setTimeout(() => {
                if (window && window.location) {
                    window.location.reload();
                }
            }, 3000);

        })();
    }

    render() {
        const imgStyle = {
            width: "100%"
        };

        const rowStle = {
            marginBottom: "5px"
        };

        return (
            <React.Fragment>

                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card card-primary card-outline card-outline-tabs">
                                <div className="card-header p-0 border-bottom-0">
                                    <ul className="nav nav-tabs" style={{ height: 'auto' }} id="custom-tabs-four-tab" role="tablist">
                                        <li className="nav-item">
                                            <a className="active d-inline-block" id="custom-tabs-four-fcdrr_reporting-tab" data-toggle="pill" href="#custom-tabs-four-fcdrr_reporting" role="tab" aria-controls="custom-tabs-four-fcdrr_reporting" aria-selected="true">
                                                <span className='px-4 py-2 text-uppercase text-md' style={{ display: 'inline-block' }}>FCDRR Reporting</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className=" d-inline-block" id="custom-tabs-four-fcdrr_commodities-tab" data-toggle="pill" href="#custom-tabs-four-fcdrr_commodities" role="tab" aria-controls="custom-tabs-four-fcdrr_commodities" aria-selected="false">
                                                <span className='px-4 py-2 text-uppercase text-md' style={{ display: 'inline-block' }}>FCDRR Commodities</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-body">
                                    <div className="tab-content" id="custom-tabs-four-tabContent">
                                        <div className="tab-pane fade show active" id="custom-tabs-four-fcdrr_reporting" role="tabpanel" aria-labelledby="custom-tabs-four-fcdrr_reporting-tab">

                                            <div className="row">
                                                {/* Settings body */}
                                                <div className="col-sm-12">
                                                    <div className="card">
                                                        <div className='card-header'>
                                                            <h6 className='text-muted text-uppercase mb-0'>Reporting days window period</h6>
                                                        </div>
                                                        <div className="card-body">

                                                            <ul className="list-group list-group-flush">
                                                                <li className="list-group-item" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                                                                    <label htmlFor="window_period">Length</label>
                                                                    <input type="number" min={0}
                                                                        onChange={(event) => {
                                                                            // this.windowPeriodhandler(event.target.value, "window_period")
                                                                            this.setState({
                                                                                newPeriod: event.target.value
                                                                            })
                                                                        }
                                                                        }
                                                                        // value={this.state.windowPeriod}
                                                                        placeholder={'Current: ' + this.state.windowPeriod}
                                                                        className="form-control" id="window_period" required
                                                                    />
                                                                </li>
                                                                {/* <li className="list-group-item">Dapibus ac facilisis in</li>
                                    <li className="list-group-item">Vestibulum at eros</li> */}
                                                            </ul>
                                                        </div>
                                                        <div className='card-footer p-3'>
                                                            <button type='button' className='btn btn-primary py-2' onClick={() => {
                                                                if (this.state.newPeriod && this.state.newPeriod != this.state.windowPeriod && this.state.newPeriod != null) {
                                                                    this.windowPeriodhandler(this.state.newPeriod, "window_period")
                                                                } else {
                                                                    this.setState({
                                                                        message: 'Please enter a valid value'
                                                                    })
                                                                    $('#settingModal').modal('toggle');
                                                                }
                                                            }}>Save Changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="tab-pane fade" id="custom-tabs-four-fcdrr_commodities" role="tabpanel" aria-labelledby="custom-tabs-four-fcdrr_commodities-tab">

                                            <div className="row">
                                                <div className='col-sm-12'>
                                                    <div className="card">
                                                        <div className='card-header'>
                                                            <h6 className='text-muted text-uppercase mb-0'>Add new commodity</h6>
                                                        </div>
                                                        <div className='card-body'>
                                                            <div className='row'>
                                                                <div className='col-sm-4'>
                                                                    <div className="form-group">
                                                                        <label htmlFor="commodity_name" className="control-label">Commodity name:</label>
                                                                        <input type="text" name="commodity_name" id="input"
                                                                            className="form-control"
                                                                            title="Commodity name"
                                                                            placeholder="Commodity name"
                                                                            value={this.state.newCommodity.commodity_name}
                                                                            onChange={evt => {
                                                                                this.setState({
                                                                                    newCommodity: {
                                                                                        ...this.state.newCommodity,
                                                                                        commodity_name: evt.target.value
                                                                                    }
                                                                                })
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className='col-sm-4'>
                                                                    <div className="form-group">
                                                                        <label htmlFor="unit_of_issue" className="control-label">Unit of issue:</label>
                                                                        <input type="text" name="unit_of_issue" id="input"
                                                                            className="form-control"
                                                                            title="Unit of issue"
                                                                            placeholder="Unit of issue"
                                                                            value={this.state.newCommodity.unit_of_issue ? 
                                                                                this.state.newCommodity.unit_of_issue : this.state.newCommodity.unit_of_issue ? 
                                                                                    this.state.newCommodity.unit_of_issue : ''}
                                                                            onChange={evt => {
                                                                                this.setState({
                                                                                    newCommodity: {
                                                                                        ...this.state.newCommodity,
                                                                                        unit_of_issue: evt.target.value
                                                                                    }
                                                                                })
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className='col-sm-4'>
                                                                    <div className="form-group">
                                                                        <label htmlFor="manufacturer" className="control-label">Manufacturer:</label>
                                                                        <input type="text" name="manufacturer" id="input"
                                                                            className="form-control"
                                                                            title="Manufacturer"
                                                                            placeholder="Manufacturer"
                                                                            value={this.state.newCommodity.manufacturer}
                                                                            onChange={evt => {
                                                                                this.setState({
                                                                                    newCommodity: {
                                                                                        ...this.state.newCommodity,
                                                                                        manufacturer: evt.target.value
                                                                                    }
                                                                                })
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='card-footer'>
                                                            <button type='button' className='btn btn-primary py-2' onClick={() => {
                                                                this.addCommodity()
                                                            }}>Save Changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-sm-12'>
                                                    <div className="card">
                                                        <div className='card-header'>
                                                            <h6 className='text-muted text-uppercase mb-0'>All commodities</h6>
                                                        </div>
                                                        <div className="card-body">
                                                            <table className="table table-bordered table-sm">
                                                                <thead style={{ backgroundColor: '#eae8e9' }}>
                                                                    <tr>
                                                                        <th className='text-sm text-uppercase text-muted'>Commodity</th>
                                                                        <th className='text-sm text-uppercase text-muted'>Unit of issue</th>
                                                                        <th className='text-sm text-uppercase text-muted'>Manufacturer</th>
                                                                        <th className='text-sm text-uppercase text-muted'>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        (this.state.commodities && this.state.commodities.length > 0) ? this.state.commodities.map((commodity, index) => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>{commodity.commodity_name}</td>
                                                                                    <td>{commodity.unit_of_issue}</td>
                                                                                    <td>{commodity.manufacturer}</td>
                                                                                    <td>
                                                                                        <button type='button' className='btn btn-sm btn-info mx-1' onClick={() => {
                                                                                            this.editCommodity(commodity.id)
                                                                                        }}>Edit</button>
                                                                                        <button type='button' className='btn btn-danger btn-sm mx-1' onClick={() => {
                                                                                            // if(window.confirm('Are you sure you want to delete this commodity?')){
                                                                                            this.deleteCommodity(commodity.id)
                                                                                            // }
                                                                                        }}>
                                                                                            <i className='fa fa-delete'></i> Delete</button>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        }) : <tr>
                                                                            <td colSpan='4' className='text-center'>
                                                                                <span className='badge badge-default text-sm py-2'>No commodities added</span>
                                                                            </td>
                                                                        </tr>
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>



                {/* Message modal */}
                <div className="modal fade" id="settingModal" tabIndex="-1" role="dialog" aria-labelledby="settingModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="settingModalTitle">Notice!</h5>
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

                {/* End Message modal */}
            </React.Fragment >
        );
    }

}

export default FcdrrSetting;

if (document.getElementById('fcdrr_settings')) {
    ReactDOM.render(<FcdrrSetting />, document.getElementById('fcdrr_settings'));
}
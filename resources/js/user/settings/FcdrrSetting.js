import React from 'react';
import ReactDOM from 'react-dom';
import FcdrrTool from '../qc/participant/FcdrrTool';
import { SaveFcdrrSetting, GetAllFcdrrSettings } from '../../components/utils/Helpers';

class FcdrrSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            windowPeriod: 0,
            newState: 0,
        }
        this.windowPeriodhandler = this.windowPeriodhandler.bind(this);
    }

    componentDidMount() {


        (async () => {

            let response = await GetAllFcdrrSettings();
            let windowPeriod = 5;

            if (response.status == 500) {
                this.setState({
                    message: response.data.Message,
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

        })();
    }

    windowPeriodhandler(value, name) {
        this.setState({
            windowPeriod: value,
        });

        (async () => {

            let response = await SaveFcdrrSetting(value, name);

            if (response.status == 500) {
                this.setState({
                    message: response?.data?.Message || response?.Message || 'Error saving settings',
                });
                $('#settingModal').modal('toggle');
            }else{
                this.setState({
                    message: response?.data?.Message || response?.Message || 'Settings saved successfully',
                });
                $('#settingModal').modal('toggle');
            }

            setTimeout(() => {
                if(window && window.location){
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

                <div className="row">
                    {/* Settings side panel */}
                    <div className="col-sm-4">
                        <div className="card" style={{ "width": "18rem" }}>
                            <div className="card-header">
                                FCDRR Settings Menu
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <a href="#">Report</a>
                                </li>
                                {/* <li className="list-group-item">Dapibus ac facilisis in</li>
                                <li className="list-group-item">Vestibulum at eros</li> */}
                            </ul>
                        </div>
                    </div>

                    {/* Settings body */}
                    <div className="col-sm-8">
                        <div className="card">
                            <div className='card-header'>
                                <h6 className='text-muted text-uppercase mb-0'>Reporting days window period</h6>
                            </div>
                            <div className="card-body">

                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item" style={{display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center'}}>
                                        <label htmlFor="window_period">Length</label>
                                        <input type="number" min={0} 
                                            onChange={ (event) => {
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
                                    if(this.state.newPeriod && this.state.newPeriod != this.state.windowPeriod && this.state.newPeriod != null){
                                        this.windowPeriodhandler(this.state.newPeriod, "window_period")
                                    }else{
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
            </React.Fragment>
        );
    }

}

export default FcdrrSetting;

if (document.getElementById('fcdrr_settings')) {
    ReactDOM.render(<FcdrrSetting />, document.getElementById('fcdrr_settings'));
}
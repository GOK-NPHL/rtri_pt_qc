import React from 'react';
import ReactDOM from 'react-dom';
import FcdrrTool from '../qc/participant/FcdrrTool';
import { SaveFcdrrSetting, GetAllFcdrrSettings } from '../../components/utils/Helpers';

class FcdrrSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            windowPeriod: 0
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
                    windowPeriod: windowPeriod
                })
            }

        })();
    }

    windowPeriodhandler(value, name) {
        this.setState({
            windowPeriod: value
        });

        (async () => {

            let response = await SaveFcdrrSetting(value, name);

            if (response.status == 500) {
                this.setState({
                    message: response.data.Message,
                });
                $('#settingModal').modal('toggle');
            }

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

                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <h6>Reporting days window period</h6>
                                    <label htmlFor="window_period">Role name</label>
                                    <input type="number" onChange={
                                        (event) => this.windowPeriodhandler(event.target.value, "window_period")
                                    }
                                        value={this.state.windowPeriod} className="form-control" id="window_period" required />
                                </li>
                                {/* <li className="list-group-item">Dapibus ac facilisis in</li>
                                <li className="list-group-item">Vestibulum at eros</li> */}
                            </ul>
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
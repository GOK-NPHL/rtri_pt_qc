import React from 'react';
import ReactDatePicker from 'react-datepicker';
import ReactDOM from 'react-dom';
import { matchPath } from "react-router";
import FcdrrTool from '../qc/participant/FcdrrTool';
import ReportingRate from './indicators/ReportingRate';

class FcdrrIndicators extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reportId: '',
            reportDate: ''
        }
        this.setCurrentPeriod = this.setCurrentPeriod.bind(this);
    }

    componentDidMount() {

        // let pathname = window.location.pathname;
        // let pathObject = matchPath(pathname, {
        //     path: `/get-fcdrr-report/:reportId`,
        // });
        // console.log(pathObject.params.reportId)
        // this.setState({
        //     reportId: pathObject.params.reportId
        // });

    }

    setCurrentPeriod(period) {
        this.setState({
            reportDate: period
        })
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
                <div className="row mb-4">
                    <strong>Report period: </strong>
                    {/* <input type="month" /> */}
                    <ReactDatePicker
                        dateFormat="yyyy/MM"
                        selected={this.state.reportDate}
                        onChange={(date) => {
                            this.setState({
                                reportDate: date
                            })
                        }}
                    />
                </div>

                <div className="row">
                    <div className="col-sm-4" data-toggle="tooltip" data-placement="bottom" title="percentage of number of facilities that have reported out of total">
                        <ReportingRate period={this.state.reportDate} setCurrentPeriod={this.setCurrentPeriod}/>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default FcdrrIndicators;

if (document.getElementById('fcdrr_indicators')) {
    ReactDOM.render(<FcdrrIndicators />, document.getElementById('fcdrr_indicators'));
}
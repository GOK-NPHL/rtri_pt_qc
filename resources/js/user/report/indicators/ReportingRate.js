import { times } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { GetFcdrrReportRates } from '../../../components/utils/Helpers';

class ReportingRate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reportingRate: 0,
            month: '',
            total_labs: ''
        }
    }

    componentDidMount() {

        (async () => {
            let response = await GetFcdrrReportRates();
            this.setState({
                reportingRate: response['report_rates'],
                month: response['period'],
                total_labs: response['total_labs']
            });
        })();
    }

    render() {
        const imgStyle = {
            width: "100%"
        };

        const borderLeftGreen = {
            borderLeft: "5px solid green"
        }

        return (

            <div className="col-sm-4" data-toggle="tooltip" data-placement="bottom" title="percentage of number of facilities that have reported out of total">
                <div className="card">
                    <div style={borderLeftGreen} className="card-body">
                        <u><h4>Reporting Rates.</h4></u>
                        <p>Rate: <span>{this.state.reportingRate}%</span></p>
                        <p>period: <span>{this.state.month}</span></p>
                        <p>total labs: <span>{this.state.total_labs}</span></p>

                    </div>
                </div>
            </div>

        );
    }

}

export default ReportingRate;

import React from 'react';
import ReactDOM from 'react-dom';
import { GetFcdrrReportRates } from '../../../components/utils/Helpers';

class ReportingRate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reportId: '',
        }
    }

    componentDidMount() {

        (async () => {
            let response = await GetFcdrrReportRates();
            this.setState({
                data: response
            });
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

            <div className="col-sm-4" data-toggle="tooltip" data-placement="bottom" title="percentage of number of facilities that have reported out of total">
                <div className="card">
                    <div className="card-body">
                        Reporting Rates.
                    </div>
                </div>
            </div>

        );
    }

}

export default ReportingRate;

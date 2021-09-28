import React from 'react';
import ReactDOM from 'react-dom';
import { FetchQcByMonthCountyFacility } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import QCByMonthByCountyAndFacility from './QCByMonthByCountyAndFacility';
import QCByMonthByAndFacility from './QCByMonthByAndFacility';
import QCByKitLot from './QCByKitLot';
import QCByRTRIKitLot from './QCByRTRIKitLot';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            qCByMonthByCountyAndFacility: {}
        }
    }

    componentDidMount() {

        (async () => {
            let qCByMonthByCountyAndFacility = await FetchQcByMonthCountyFacility();
            // console.log(qCByMonthByCountyAndFacility);
            this.setState({
                qCByMonthByCountyAndFacility: qCByMonthByCountyAndFacility
            })
        })();
    }

    render() {

        return (
            <React.Fragment>
                <QCByMonthByCountyAndFacility data={this.state.qCByMonthByCountyAndFacility} />
                <QCByMonthByAndFacility data={this.state.qCByMonthByCountyAndFacility} />
                <QCByKitLot data={this.state.qCByMonthByCountyAndFacility} />
                <QCByRTRIKitLot data={this.state.qCByMonthByCountyAndFacility} />
            </React.Fragment>
        );
    }

}

export default Dashboard;

if (document.getElementById('admin_dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('admin_dashboard'));
}
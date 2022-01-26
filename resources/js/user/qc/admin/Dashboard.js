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
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mb-4 p-3' style={{backgroundColor: '#f3f4f8', borderColor: '#7c5656', borderRadius: '5px', borderWidth: '1px'}}>
                            <QCByMonthByCountyAndFacility data={this.state.qCByMonthByCountyAndFacility} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12 mb-4 p-3' style={{backgroundColor: '#f3f4f8', borderColor: '#7c5656', borderRadius: '5px', borderWidth: '1px'}}>
                            <QCByMonthByAndFacility data={this.state.qCByMonthByCountyAndFacility} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12 mb-4 p-3' style={{backgroundColor: '#f3f4f8', borderColor: '#7c5656', borderRadius: '5px', borderWidth: '1px'}}>
                            <QCByKitLot data={this.state.qCByMonthByCountyAndFacility} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12 mb-4 p-3' style={{backgroundColor: '#f3f4f8', borderColor: '#7c5656', borderRadius: '5px', borderWidth: '1px'}}>
                            <QCByRTRIKitLot data={this.state.qCByMonthByCountyAndFacility} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default Dashboard;

if (document.getElementById('admin_dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('admin_dashboard'));
}
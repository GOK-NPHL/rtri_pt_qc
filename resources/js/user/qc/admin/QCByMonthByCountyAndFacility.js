import React from 'react';
import ReactDOM from 'react-dom';
import { FetchQcByMonthCountyFacility } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import { MDBDataTable } from 'mdbreact';
import ExportDashboardToCSV from './ExportDashboardToCSV';

class QCByMonthByCountyAndFacility extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
        this.formatDataToTableFormat = this.formatDataToTableFormat.bind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                data: this.props.data
            })
        }
    }

    formatDataToTableFormat(data) {
        console.log("verify data");
        console.log(data);
        let dataElements = {};

        let recents = data.recent;
        recents.map((recentTest) => {
            let labName = recentTest.lab_name.trim().toLowerCase().replace(/\s/g, '');
            let countyName = recentTest.county_name.trim().toLowerCase().replace(/\s/g, '');
            let kitLot = String(recentTest.kit_lot_no).trim().toLowerCase().replace(/\s/g, '');
            let testingDate = String(recentTest.testing_date).trim().toLowerCase().replace(/\s/g, '');

            let dataKey = countyName + labName + kitLot + testingDate;

            dataElements[dataKey] = {
                'invalids': 0,
                'correct_negative': 0,
                'correct_longterm': 0,
                'correct_recent': (recentTest.correct_count * 100) / recentTest.total_tests,
                'total_tested': recentTest.total_tests,
                'kit_lot ': recentTest.kit_lot_no,
                'lab_name': recentTest.lab_name,
                'county': recentTest.county_name,
            }
        });

        let negatives = data.negative;
        negatives.map((test) => {
            let labName = test.lab_name.trim().toLowerCase().replace(/\s/g, '');
            let countyName = test.county_name.trim().toLowerCase().replace(/\s/g, '');
            let kitLot = String(test.kit_lot_no).trim().toLowerCase().replace(/\s/g, '');
            let testingDate = String(test.testing_date).trim().toLowerCase().replace(/\s/g, '');
            let dataKey = countyName + labName + kitLot + testingDate;
            dataElements[dataKey]['correct_negative'] = (test.correct_count * 100) / test.total_tests;
        });

        let longterms = data.longterm;
        longterms.map((test) => {
            let labName = test.lab_name.trim().toLowerCase().replace(/\s/g, '');
            let countyName = test.county_name.trim().toLowerCase().replace(/\s/g, '');
            let kitLot = String(test.kit_lot_no).trim().toLowerCase().replace(/\s/g, '');
            let testingDate = String(test.testing_date).trim().toLowerCase().replace(/\s/g, '');
            let dataKey = countyName + labName + kitLot + testingDate;
            dataElements[dataKey]['correct_longterm'] = (test.correct_count * 100) / test.total_tests;
        });

        let invalidss = data.invalids;
        invalidss.map((test) => {
            let labName = test.lab_name.trim().toLowerCase().replace(/\s/g, '');
            let countyName = test.county_name.trim().toLowerCase().replace(/\s/g, '');
            let kitLot = String(test.kit_lot_no).trim().toLowerCase().replace(/\s/g, '');
            let testingDate = String(test.testing_date).trim().toLowerCase().replace(/\s/g, '');
            let dataKey = countyName + labName + kitLot + testingDate;
            dataElements[dataKey]['invalids'] = (test.correct_count * 100) / test.total_tests;
        });

        return Object.values(dataElements);
    }

    render() {
        let rowzz = [];

        let isDataEmpty = Object.keys(this.state.data).length; //gives 0 if empty or an integer > 0 if non-empty
        if (isDataEmpty != 0) {
            rowzz = this.formatDataToTableFormat(this.state.data);
        }

        let columnzz = [
            {
                label: 'County',
                field: 'county',
                sort: 'asc',
                width: 150
            },
            {
                label: 'RTRI Lab/Facility ',
                field: 'lab_name',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Kit lot ',
                field: 'kit_lot ',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Number of QC Specimens tested ',
                field: 'total_tested',
                sort: 'asc',
                width: 150
            },
            {
                label: '% correctly identified as Recent',
                field: 'correct_recent',
                sort: 'asc',
                width: 150
            },
            {
                label: '% correctly identified as long term',
                field: 'correct_longterm',
                sort: 'asc',
                width: 150
            },
            {
                label: '% correctly identified as Negative',
                field: 'correct_negative',
                sort: 'asc',
                width: 150
            },
            {
                label: '% Invalid ',
                field: 'invalids',
                sort: 'asc',
                width: 150
            }
        ]

        let data = {
            columns: columnzz,
            rows: rowzz
        };

        let qCByMonthByCountyAndFacility = <React.Fragment>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                    <a className="nav-link nav-link-custom active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link nav-link-custom" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link nav-link-custom" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

                </div>
                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div>
                <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div>
            </div>
        </React.Fragment>

        return (
            <React.Fragment>
                {/* {qCByMonthByCountyAndFacility} */}
                {/* <ExportDashboardToCSV data={rowzz} columns={columnzz}/> */}
                <MDBDataTable
                    striped
                    // bootstrap4
                    bordered
                    small
                    data={data}
                />
            </React.Fragment>
        );
    }

}

export default QCByMonthByCountyAndFacility;
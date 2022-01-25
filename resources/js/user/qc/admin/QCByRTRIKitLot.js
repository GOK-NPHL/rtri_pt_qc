import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { MDBDataTable } from 'mdbreact';
import ExportDashboardToCSV from './ExportDashboardToCSV';

class QCByRTRIKitLot extends React.Component {

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

        let dataElements = {};

        let recents = data.recent;
        recents.map((recentTest) => {
            let kitLot = String(recentTest.kit_lot_no).trim().toLowerCase().replace(/\s/g, '');

            let dataKey = kitLot;

            dataElements[dataKey] = {
                'invalids': 0,
                'correct_negative': 0,
                'correct_longterm': 0,
                'correct_recent': Math.round((recentTest.correct_count * 100) / recentTest.total_tests),
                'total_tested': recentTest.total_tests,
                'rtri_lot_no ': recentTest.kit_lot_no

            }
        });

        let negatives = data.negative;
        negatives.map((test) => {
            let kitLot = String(test.kit_lot_no).trim().toLowerCase().replace(/\s/g, '');
            let dataKey = kitLot;
            dataElements[dataKey]['correct_negative'] = Math.round((test.correct_count * 100) / test.total_tests);
            dataElements[dataKey]['total_tested'] = test.total_tests + dataElements[dataKey]['total_tested'];
        });

        let longterms = data.longterm;
        longterms.map((test) => {
            let kitLot = String(test.kit_lot_no).trim().toLowerCase().replace(/\s/g, '');
            let dataKey = kitLot;
            dataElements[dataKey]['correct_longterm'] = Math.round((test.correct_count * 100) / test.total_tests);
            dataElements[dataKey]['total_tested'] = test.total_tests + dataElements[dataKey]['total_tested'];
        });

        let invalidss = data.invalids;
        invalidss.map((test) => {
            let kitLot = String(test.kit_lot_no).trim().toLowerCase().replace(/\s/g, '');
            let dataKey = kitLot;
            dataElements[dataKey]['invalids'] = test.correct_count;
            // dataElements[dataKey]['total_tested'] = test.total_tests + dataElements[dataKey]['total_tested'];
        });

        for (const [key, value] of Object.entries(dataElements)) {
            // console.log(value);
            value['invalids'] = Math.round((value['invalids'] * 100) / value['total_tested']);
        }

        return Object.values(dataElements);
    }

    render() {
        console.log(this.state.data['rtri_lot_no']);
        let rowzz = [];
        if (this.state.data) {
            let isDataEmpty = Object.keys(this.state.data).length; //gives 0 if empty or an integer > 0 if non-empty
            if (isDataEmpty != 0) {
                try {
                    rowzz = this.formatDataToTableFormat(this.state.data['rtri_lot_no']);
                } catch (err) {
                }
            }
        }

        let columnzz = [

            {
                label: 'RTRI Kit lot ',
                field: 'rtri_lot_no ',
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
        ];

        let data = {
            columns: columnzz,
            rows: rowzz
        };

        let qCByMonthByAndFacility = <React.Fragment>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                    <a className="nav-link nav-link-custom active" id="home-tab" data-toggle="tab"
                        href="#home" role="tab" aria-controls="home" aria-selected="true">Tabular data</a>
                </li>
                {/* <li className="nav-item">
                    <a className="nav-link nav-link-custom" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link nav-link-custom" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
                </li> */}
            </ul>
            <div className="tab-content mt-3" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <MDBDataTable
                        striped
                        // bootstrap4
                        bordered
                        small
                        data={data}
                        exportToCSV={true}
                    />
                </div>
                {/* <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div> */}
                {/* <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div> */}
            </div>
        </React.Fragment>

        return (
            <React.Fragment>
                <h4 className="mb-4">QC panel performance by RTRI Kit Lot</h4>
                {qCByMonthByAndFacility}
                {/* <ExportDashboardToCSV data={rowzz} columns={columnzz}/> */}
            </React.Fragment>
        );
    }

}

export default QCByRTRIKitLot;
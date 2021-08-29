import React from 'react';
import ReactDOM from 'react-dom';

import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';

class ExportDashboardToCSV extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {

    }

    render() {
        const { ExportCSVButton } = CSVExport;
        return (
            <ToolkitProvider
                keyField="id"
                data={this.props.data}
                columns={this.props.columns}
                exportCSV
            >
                {
                    props => (
                        <div>
                            <ExportCSVButton {...props.csvProps}>Export CSV!!</ExportCSVButton>
                            <hr />
                            {/* <BootstrapTable {...props.baseProps} /> */}
                        </div>
                    )
                }
            </ToolkitProvider>

        );
    }

}

export default ExportDashboardToCSV;

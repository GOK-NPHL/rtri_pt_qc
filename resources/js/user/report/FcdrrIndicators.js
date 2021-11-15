import React from 'react';
import ReactDOM from 'react-dom';
import { matchPath } from "react-router";
import FcdrrTool from '../qc/participant/FcdrrTool';

class FcdrrIndicators extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reportId: '',
        }
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

    render() {
        const imgStyle = {
            width: "100%"
        };

        const rowStle = {
            marginBottom: "5px"
        };

        return (
            <React.Fragment>
                fine
            </React.Fragment>
        );
    }

}

export default FcdrrIndicators;

if (document.getElementById('fcdrr_indicators')) {
    ReactDOM.render(<FcdrrIndicators />, document.getElementById('fcdrr_indicators'));
}
import React from 'react';
import ReactDOM from 'react-dom';
import { FetchQcByMonthCountyFacility } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

        (async () => {
            let response = await FetchQcByMonthCountyFacility();
            console.log(response);
        })();

    }


    render() {

        return (
            <React.Fragment>
                alert(dahsboard);
            </React.Fragment>
        );
    }

}

export default Dashboard;

if (document.getElementById('admin_dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('admin_dashboard'));
}
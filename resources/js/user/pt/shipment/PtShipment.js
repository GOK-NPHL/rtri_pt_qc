import React from 'react';
import ReactDOM from 'react-dom';
import { FetchSubmissions } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import AddShipement from './AddShipment';
import ListShipment from './ListShipment';


class PtShipment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowNewShipmentPage: false,
            newShipmentButtonText: 'Add new PT shipment'
        }
    }

    componentDidMount() {

        (async () => {
            let response = await FetchSubmissions();
            console.log(response);
        })();

    }

    render() {

        return (
            <React.Fragment>
                <div id='user_table' className='row'>
                    <div className="col-sm-12 mb-3 mt-3">
                        {this.state.isShowNewShipmentPage ? <h3 className="float-left">New Shipment</h3> : <h3 className="float-left">All Shipments</h3>}
                        <a style={{ "color": "white" }}
                            onClick={() => {
                                this.setState({
                                    isShowNewShipmentPage: !this.state.isShowNewShipmentPage,
                                })
                            }}
                            type="button" href="#"
                            className="btn btn-primary 
                float-right">{this.state.isShowNewShipmentPage ? 'Close new shipment page' : 'Add new PT shipment'}</a>
                    </div>
                </div>
                {this.state.isShowNewShipmentPage ? <AddShipement /> : ''}
                <ListShipment isShowNewShipmentPage={this.state.isShowNewShipmentPage} />
            </React.Fragment>
        );
    }

}

export default PtShipment;

if (document.getElementById('pt_shipment')) {
    ReactDOM.render(<PtShipment />, document.getElementById('pt_shipment'));
}
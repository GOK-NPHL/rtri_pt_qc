import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import { FetchSubmissions } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';


class ListPersonel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            isSubmitResult: false,
            dtObject: null
        }
    }

    componentDidMount() {

        (async () => {
            let response = await FetchSubmissions();
        })();

    }


    render() {

        return (
            <React.Fragment>
                alert(add_personel);
            </React.Fragment>
        );
    }

}

export default AddPersonel;

if (document.getElementById('list_personel')) {
    ReactDOM.render(<ListPersonel />, document.getElementById('list_personel'));
}
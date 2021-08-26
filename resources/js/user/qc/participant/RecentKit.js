import React from 'react';

class RecentKit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    componentDidMount() {

    }

    render() {

        return (
            <React.Fragment>

                <tr>
                    <td>QC - Recent</td>
                    <td><input onClick={() => this.props.resultRecent(event)} value="c" type="checkbox" /></td>
                    <td><input onClick={() => this.props.resultRecent(event)} value="v" type="checkbox" /></td>
                    <td ><input onClick={() => this.props.resultRecent(event)} value="lt" type="checkbox" /></td>
                    <td onChange={() => this.props.qcInterpretationRecent(event)}>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="lt"
                                name="recent-radio" id="result_lt" />
                            <label className="form-check-label" htmlFor="result_lt">
                                LT
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="recent"
                                name="recent-radio" id="result_recent" />
                            <label className="form-check-label" htmlFor="result_recent">
                                recent
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="neg"
                                name="recent-radio" id="result_neg" />
                            <label className="form-check-label" htmlFor="result_neg">
                                neg
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="invalid"
                                name="recent-radio" id="result_invalid" />
                            <label className="form-check-label" htmlFor="result_invalid">
                                invalid
                            </label>
                        </div>
                    </td>
                </tr>

            </React.Fragment>

        );
    }

}

export default RecentKit;
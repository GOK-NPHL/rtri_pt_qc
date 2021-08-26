import React from 'react';

class NegativeKit extends React.Component {

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
                    <td>QC -Negative</td>
                    <td ><input onClick={this.props.resultNegative(event)} value="c" type="checkbox" /></td>
                    <td ><input onClick={this.props.resultNegative(event)} value="v" type="checkbox" /></td>
                    <td ><input onClick={this.props.resultNegative(event)} value="lt" type="checkbox" /></td>
                    <td onChange={this.props.qcInterpretationNegative(event)}>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="lt"
                                name="negative-radio" id="result_lt" />
                            <label className="form-check-label" htmlFor="result_lt">
                                LT
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="recent"
                                name="negative-radio" id="result_recent" />
                            <label className="form-check-label" htmlFor="result_recent">
                                recent
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="neg"
                                name="negative-radio" id="result_neg" />
                            <label className="form-check-label" htmlFor="result_neg">
                                neg
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" value="invalid"
                                type="radio" name="negative-radio" id="result_invalid" />
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

export default NegativeKit;
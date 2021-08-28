import React from 'react';

class NegativeKit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isNegativeTestHasRepeats: false,
            isShowNegativeRepeat: false,
            kitPositionInForm: this.props.kitPositionInForm
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isReaptsEmpty != this.props.isReaptsEmpty) {
            this.setState({
                isNegativeTestHasRepeats: this.props.isReaptsEmpty
            })
        }
    }

    render() {
        
        return (
            <React.Fragment>

                <tr>
                    <td>{this.props.isRepeat ? 'Negative repeat' : 'QC -Negative'}</td>
                    <td ><input onClick={
                        () => {
                            if (this.props.isRepeat) {
                                this.props.resultNegative(event, 'repeat', this.state.kitPositionInForm);
                            } else {
                                this.props.resultNegative(event)
                            }
                        }
                    } value="c" type="checkbox" /></td>
                    <td ><input onClick={

                        () => {
                            if (this.props.isRepeat) {
                                this.props.resultNegative(event, 'repeat', this.state.kitPositionInForm);
                            } else {
                                this.props.resultNegative(event)
                            }
                        }
                    } value="v" type="checkbox" /></td>
                    <td ><input onClick={
                        () => {
                            if (this.props.isRepeat) {
                                this.props.resultNegative(event, 'repeat', this.state.kitPositionInForm);
                            } else {
                                this.props.resultNegative(event)
                            }
                        }
                    } value="lt" type="checkbox" /></td>
                    <td onChange={
                        (event) => {
                            if (event.target.value == 'invalid') {
                                this.setState({
                                    isShowNegativeRepeat: true
                                })
                            } else {
                                this.setState({
                                    isShowNegativeRepeat: false
                                })
                            }

                            if (this.props.isRepeat) {
                                this.props.qcInterpretationNegative(event, 'repeat', this.state.kitPositionInForm);
                            } else {
                                this.props.qcInterpretationNegative(event)
                            }

                        }
                    }>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="lt"
                                name={`negative-radio-${this.props.radioId}`} id="result_lt" />
                            <label className="form-check-label" htmlFor="result_lt">
                                LT
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="recent"
                                name={`negative-radio-${this.props.radioId}`} id="result_recent" />
                            <label className="form-check-label" htmlFor="result_recent">
                                recent
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="neg"
                                name={`negative-radio-${this.props.radioId}`} id="result_neg" />
                            <label className="form-check-label" htmlFor="result_neg">
                                neg
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" value="invalid"
                                type="radio" name={`negative-radio-${this.props.radioId}`} id="result_invalid" />
                            <label className="form-check-label" htmlFor="result_invalid">
                                invalid
                            </label>
                        </div>
                    </td>

                    {
                        this.state.isShowNegativeRepeat && !this.state.isNegativeTestHasRepeats ?
                            <td>
                                <button onClick={(event) => {
                                    this.props.repeatNegativeTest(event);
                                    this.setState({ isNegativeTestHasRepeats: true })
                                }} type="button" className="btn btn-sm btn-outline-primary">Repeat</button>
                            </td> :
                            <td style={{ "display": "none" }}></td>
                    }

                    {
                        (this.state.isNegativeTestHasRepeats && !this.props.isMainKit) ||
                            (!this.state.isShowNegativeRepeat && !this.props.isMainKit) ?
                            <td>
                                <button onClick={(event) => {
                                    this.props.deleteRepeatkit(this.state.kitPositionInForm, 'negative');
                                }} type="button" className="btn btn-sm btn-outline-primary">Delete</button>
                            </td> :
                            <td style={{ "display": "none" }}></td>
                    }

                </tr>

            </React.Fragment>
        );
    }

}

export default NegativeKit;
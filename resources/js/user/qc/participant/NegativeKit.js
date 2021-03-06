import React from 'react';

class NegativeKit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isNegativeTestHasRepeats: false,
            isShowNegativeRepeat: false,
            kitPositionInForm: this.props.kitPositionInForm,
            hasNegativeControl: null,
            hasNegativeVerification: null,
            hasNegativeLongterm: null,
        }
    }

    componentDidMount() {
        if (this.props.isEdit) {
            this.setState({
                hasNegativeControl: this.props.resultNegativeEditResults['c'] == 1 ? true : false,
                hasNegativeVerification: this.props.resultNegativeEditResults['v'] == 1 ? true : false,
                hasNegativeLongterm: this.props.resultNegativeEditResults['lt'] == 1 ? true : false
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isReaptsEmpty != this.props.isReaptsEmpty) {
            this.setState({
                isNegativeTestHasRepeats: this.props.isReaptsEmpty
            })
        }

        if (prevProps.resultNegativeEditResults != this.props.resultNegativeEditResults) {
            this.setState({
                hasNegativeControl: this.props.resultNegativeEditResults['c'] == 1 ? true : false,
                hasNegativeVerification: this.props.resultNegativeEditResults['v'] == 1 ? true : false,
                hasNegativeLongterm: this.props.resultNegativeEditResults['lt'] == 1 ? true : false
            })
        }

        if (prevProps.resultNegativeEditResults != this.props.resultNegativeEditResults) {
            this.setState({

            })
        }

        if (prevProps.resultNegativeEditResults != this.props.resultNegativeEditResults) {
            this.setState({

            })
        }

    }

    render() {

        let radioVal = 'invalid';
        if (this.props.isEdit && this.props.isRepeat) {
            radioVal = this.props.qcNegativeIntepreationEditResults[this.props.index];
        } else if (this.props.isEdit && !this.props.isRepeat) {
            radioVal = this.props.qcNegativeIntepreationEditResults;
        }


        let ltRadio = <input className="form-check-input" type="radio" value="lt"
            name={`negative-radio-${this.props.radioId}`} id="result_lt" />
        if (this.props.isEdit && radioVal == 'lt') {
            ltRadio = <input className="form-check-input" type="radio" value="lt"
                name={`negative-radio-${this.props.radioId}`} id="result_lt" checked />
        }


        let invalidLt = <input className="form-check-input" value="invalid"
            type="radio" name={`negative-radio-${this.props.radioId}`} id="result_invalid" />
        if (this.props.isEdit && radioVal == 'invalid') {
            invalidLt = <input className="form-check-input" value="invalid"
                type="radio" name={`negative-radio-${this.props.radioId}`} id="result_invalid" checked />
        }


        let negLt =
            <input className="form-check-input" type="radio" value="neg"
                name={`negative-radio-${this.props.radioId}`} id="result_neg" />

        if (this.props.isEdit && radioVal == 'neg') {
            negLt = <input className="form-check-input" type="radio" value="neg"
                name={`negative-radio-${this.props.radioId}`} id="result_neg" checked />
        }


        let recentLt = <input className="form-check-input" type="radio" value="recent"
            name={`negative-radio-${this.props.radioId}`} id="result_recent" />
        if (this.props.isEdit && radioVal == 'recent') {
            recentLt = <input className="form-check-input" type="radio" value="recent"
                name={`negative-radio-${this.props.radioId}`} id="result_recent" checked />

        }

        return (
            <React.Fragment>

                <tr>
                    <td>{this.props.isRepeat ? 'Negative repeat' : 'QC -Negative'}</td>
                    <td >
                        <input 
                        onChange={(event) => {
                            const origVal = event.target.checked;
                            // if(window && window.confirm('Are you sure you want to change this value?')){
                                // <moved from onclick
                                if (this.props.isRepeat) {
                                    this.props.resultNegative(event, 'repeat', this.state.kitPositionInForm);
                                } else {
                                    this.props.resultNegative(event)
                                }
                                // </moved from onclick
                                this.setState({
                                    hasNegativeControl: event.target.checked
                                })
                            // }else{
                            //     event.preventDefault();
                            //     event.stopPropagation();
                            //     event.target.checked = origVal;
                            // }
                        }}
                        checked={this.state.hasNegativeControl}
                        value="c" type="checkbox" />
                    </td>
                    <td >
                        <input 
                        onChange={(event) => {
                            const origVal = event.target.checked;
                            // if(window && window.confirm('Are you sure you want to change this value?')){
                                // <moved from onclick
                                if (this.props.isRepeat) {
                                    this.props.resultNegative(event, 'repeat', this.state.kitPositionInForm);
                                } else {
                                    this.props.resultNegative(event)
                                }
                                // </moved from onclick
                                this.setState({
                                    hasNegativeVerification: event.target.checked
                                })
                            // }else{
                            //     event.preventDefault();
                            //     event.stopPropagation();
                            //     event.target.checked = origVal;
                            // }
                        }}
                        checked={this.state.hasNegativeVerification}
                        value="v" type="checkbox" />
                    </td>
                    <td >
                        <input 
                            onChange={(event) => {
                                const origVal = event.target.checked;
                                // if(window && window.confirm('Are you sure you want to change this value?')){
                                    // <moved from onclick
                                    if (this.props.isRepeat) {
                                        this.props.resultNegative(event, 'repeat', this.state.kitPositionInForm);
                                    } else {
                                        this.props.resultNegative(event)
                                    }
                                    // </moved from onclick
                                    this.setState({
                                        hasNegativeLongterm: event.target.checked
                                    })
                                // }else{
                                //     event.preventDefault();
                                //     event.stopPropagation();
                                //     event.target.checked = origVal;
                                // }
                            }}
                            checked={this.state.hasNegativeLongterm}
                            value="lt" type="checkbox" />
                    </td>
                    <td onChange={
                        (event) => {
                            const origVal = event.target.value;
                            if (window && window.confirm('Are you sure you want to change this value?')) {
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
                            }else{
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }>
                        <div className="form-check form-check-inline">

                            {ltRadio}
                            <label className="form-check-label" htmlFor="result_lt">
                                LT
                            </label>
                        </div>
                        <div className="form-check form-check-inline">

                            {recentLt}
                            <label className="form-check-label" htmlFor="result_recent">
                                recent
                            </label>
                        </div>
                        <div className="form-check form-check-inline">

                            {negLt}
                            <label className="form-check-label" htmlFor="result_neg">
                                neg
                            </label>
                        </div>
                        <div className="form-check form-check-inline">

                            {invalidLt}
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
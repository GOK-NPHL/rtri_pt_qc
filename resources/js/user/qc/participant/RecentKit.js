import React from 'react';

class RecentKit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isRecentTestHasRepeats: false,
            isShowRecentRepeat: false,
            kitPositionInForm: this.props.kitPositionInForm,
            hasRecentControl: null,
            hasRecentVerification: null,
            hasRecentLongterm: null
        }

    }

    componentDidMount() {
        if (this.props.isEdit) {
            this.setState({
                hasRecentControl: this.props.resultRecentEditResults['c'] == 1 ? true : false,
                hasRecentVerification: this.props.resultRecentEditResults['v'] == 1 ? true : false,
                hasRecentLongterm: this.props.resultRecentEditResults['lt'] == 1 ? true : false
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isReaptsEmpty != this.props.isReaptsEmpty) {
            this.setState({
                isRecentTestHasRepeats: this.props.isReaptsEmpty
            })
        }
        if (prevProps.resultRecentEditResults != this.props.resultRecentEditResults) {
            this.setState({
                hasRecentControl: this.props.resultRecentEditResults['c'] == 1 ? true : false,
                hasRecentVerification: this.props.resultRecentEditResults['v'] == 1 ? true : false,
                hasRecentLongterm: this.props.resultRecentEditResults['lt'] == 1 ? true : false
            })
        }
    }

    render() {

        let radioVal = 'invalid';
        if (this.props.isEdit && this.props.isRepeat) {
            radioVal = this.props.qcRecentIntepreationEditResults[this.props.index];
        } else if (this.props.isEdit && !this.props.isRepeat) {
            radioVal = this.props.qcRecentIntepreationEditResults;
        }


        let ltRadio = <input className="form-check-input" type="radio" value="lt"
            name={`recent-radio-${this.props.radioId}`} id="result_lt" />
        if (this.props.isEdit && radioVal == 'lt') {
            ltRadio = <input className="form-check-input" type="radio" value="lt"
                name={`recent-radio-${this.props.radioId}`} id="result_lt" checked />
        }


        let invalidLt = <input className="form-check-input" type="radio" value="invalid"
            name={`recent-radio-${this.props.radioId}`} id="result_invalid_recent" />
        if (this.props.isEdit && radioVal == 'invalid') {
            invalidLt = <input className="form-check-input" type="radio" value="invalid"
                name={`recent-radio-${this.props.radioId}`} id="result_invalid_recent" checked />
        }

        let negLt =
            <input className="form-check-input" type="radio" value="neg"
                name={`recent-radio-${this.props.radioId}`} id="result_neg" />

        if (this.props.isEdit && radioVal == 'neg') {
            negLt = <input className="form-check-input" type="radio" value="neg"
                name={`recent-radio-${this.props.radioId}`} id="result_neg" checked />
        }


        let recentLt = <input className="form-check-input" type="radio" value="recent"
            name={`recent-radio-${this.props.radioId}`} id="result_recent" />
        if (this.props.isEdit && radioVal == 'recent') {
            recentLt = <input className="form-check-input" type="radio" value="recent"
                name={`recent-radio-${this.props.radioId}`} id="result_recent" checked />

        }


        return (
            <React.Fragment>

                <tr>
                    <td>{this.props.isRepeat ? 'Recent repeat' : 'QC - Recent'}</td>
                    <td><input 
                        onChange={(event) => {
                            const origVal = event.target.checked;
                            // if(window && window.confirm('Are you sure you want to change this value?')){
                                // <moved from onclick
                                if (this.props.isRepeat) {
                                    this.props.resultRecent(event, 'repeat', this.state.kitPositionInForm);
                                } else {
                                    this.props.resultRecent(event)
                                }
                                // </moved from onclick
                                this.setState({
                                    hasRecentControl: event.target.checked
                                })
                            // }else{
                            //     event.preventDefault();
                            //     event.stopPropagation();
                            //     event.target.checked = origVal;
                            // }
                        }}
                        checked={this.state.hasRecentControl}
                        value="c" type="checkbox" /></td>
                    <td><input 
                        onChange={(event) => {
                            const origVal = event.target.checked;
                            // if(window && window.confirm('Are you sure you want to change this value?')){
                                // <moved from onclick
                                if (this.props.isRepeat) {
                                    this.props.resultRecent(event, 'repeat', this.state.kitPositionInForm);
                                } else {
                                    this.props.resultRecent(event)
                                }
                                // </moved from onclick
                                this.setState({
                                    hasRecentVerification: event.target.checked
                                })
                            // }else{
                            //     event.preventDefault();
                            //     event.stopPropagation();
                            //     event.target.checked = origVal;
                            // }
                        }}
                        checked={this.state.hasRecentVerification}
                        value="v" type="checkbox" /></td>
                    <td ><input 
                        onChange={(event) => {
                            const origVal = event.target.checked;
                            // if(window && window.confirm('Are you sure you want to change this value?')){
                                // <moved from onclick
                                if (this.props.isRepeat) {
                                    this.props.resultRecent(event, 'repeat', this.state.kitPositionInForm);
                                } else {
                                    this.props.resultRecent(event)
                                }
                                // </moved from onclick
                                this.setState({
                                    hasRecentLongterm: event.target.checked
                                })
                            // }else{
                            //     event.preventDefault();
                            //     event.stopPropagation();
                            //     event.target.checked = origVal;
                            // }
                        }}
                        checked={this.state.hasRecentLongterm}

                        value="lt" type="checkbox" /></td>
                    <td onChange={
                        (event) => {
                            const origVal = event.target.value;
                            if (window && window.confirm('Are you sure you want to change this value?')) {
                                if (event.target.value == 'invalid') {
                                    this.setState({
                                        isShowRecentRepeat: true
                                    })
                                } else {
                                    this.setState({
                                        isShowRecentRepeat: false
                                    })
                                }

                                if (this.props.isRepeat) {
                                    this.props.qcInterpretationRecent(event, 'repeat', this.state.kitPositionInForm);
                                } else {
                                    this.props.qcInterpretationRecent(event)
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
                        this.state.isShowRecentRepeat && !this.state.isRecentTestHasRepeats ?
                            <td>
                                <button onClick={(event) => {
                                    this.props.repeatRecentTest(event);
                                    this.setState({ isRecentTestHasRepeats: true })
                                }} type="button" className="btn btn-sm btn-outline-primary">Repeat</button>
                            </td> :
                            <td style={{ "display": "none" }}></td>
                    }

                    {
                        (this.state.isRecentTestHasRepeats && !this.props.isMainKit) ||
                            (!this.state.isShowRecentRepeat && !this.props.isMainKit) ?
                            <td>
                                <button onClick={(event) => {
                                    this.props.deleteRepeatkit(this.state.kitPositionInForm, 'recent');
                                }} type="button" className="btn btn-sm btn-outline-primary">Delete</button>
                            </td> :
                            <td style={{ "display": "none" }}></td>
                    }
                </tr>

            </React.Fragment >

        );
    }

}

export default RecentKit;
import React from 'react';

class LongtermKit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLongtermTestHasRepeats: false,
            isShowLongtermRepeat: false,
            kitPositionInForm: this.props.kitPositionInForm,
            resultLongtermControl: false
        }

    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isReaptsEmpty != this.props.isReaptsEmpty) {
            this.setState({
                isLongtermTestHasRepeats: this.props.isReaptsEmpty,
            })
        }
        if (prevProps.resultLongtermEditResults != this.props.resultLongtermEditResults) {
            this.setState({
                resultLongtermControl: this.props.resultLongtermEditResults['c'] == 1 ? true : false
            })
        }
    }

    render() {
        let ltRadio = <input className="form-check-input" type="radio" value="lt"
            name={`long-term-radio-${this.props.radioId}`} id="result_lt"
        />
        if (this.props.isEdit && this.props.qcLongtermIntepreationEditResults == 'lt') {
            ltRadio = <input className="form-check-input" type="radio" value="lt"
                name={`long-term-radio-${this.props.radioId}`} id="result_lt"
                checked
            />
        }


        let invalidLt = <input className="form-check-input" type="radio" value="invalid"
            name={`long-term-radio-${this.props.radioId}`} id="result_invalid" />
        if (this.props.isEdit && this.props.qcLongtermIntepreationEditResults == 'invalid') {
            invalidLt = <input className="form-check-input" type="radio" value="invalid"
                name={`long-term-radio-${this.props.radioId}`} id="result_invalid"
                checked />
        }


        let negLt = <input className="form-check-input" type="radio" value="neg"
            name={`long-term-radio-${this.props.radioId}`} id="result_neg" />
        if (this.props.isEdit && this.props.qcLongtermIntepreationEditResults == 'invalid') {
            invalidLt = <input className="form-check-input" type="radio" value="neg"
                name={`long-term-radio-${this.props.radioId}`} id="result_neg" checked />
        }


        let recentLt = <input className="form-check-input" type="radio" value="recent"
            name={`long-term-radio-${this.props.radioId}`} id="result_recent" />
        if (this.props.isEdit && this.props.qcLongtermIntepreationEditResults == 'invalid') {
            recentLt = <input className="form-check-input" type="radio" value="recent"
                name={`long-term-radio-${this.props.radioId}`} id="result_recent" checked />
        }

        return (

            <React.Fragment>
                <tr >
                    <td>{this.props.isRepeat ? 'Long term repeat' : 'QC - Long Term'}</td>
                    <td ><input onClick={
                        () => {
                            if (this.props.isRepeat) {
                                this.props.resultLongterm(event, 'repeat', this.state.kitPositionInForm);
                            } else {
                                this.props.resultLongterm(event)
                            }
                        }
                    }
                        onChange={() => { }}
                        checked={this.props.isEdit && this.props.resultLongtermEditResults['c'] == 1}

                        value="c" type="checkbox" /></td>
                    <td ><input onClick={
                        () => {
                            if (this.props.isRepeat) {
                                this.props.resultLongterm(event, 'repeat', this.state.kitPositionInForm);
                            } else {
                                this.props.resultLongterm(event)
                            }
                        }
                    }
                        onChange={() => { }}
                        checked={this.props.isEdit && this.props.resultLongtermEditResults['v'] == 1}
                        value="v" type="checkbox" /></td>
                    <td ><input onClick={
                        () => {
                            if (this.props.isRepeat) {
                                this.props.resultLongterm(event, 'repeat', this.state.kitPositionInForm);
                            } else {
                                this.props.resultLongterm(event)
                            }
                        }
                    }
                        onChange={() => { }}
                        checked={this.props.isEdit && this.props.resultLongtermEditResults['lt'] == 1}
                        value="lt" type="checkbox" /></td>
                    <td onChange={
                        (event) => {
                            if (event.target.value == 'invalid') {
                                this.setState({
                                    isShowLongtermRepeat: true
                                })
                            } else {
                                this.setState({
                                    isShowLongtermRepeat: false
                                })
                            }

                            if (this.props.isRepeat) {
                                this.props.qcInterpretationLongterm(event, 'repeat', this.state.kitPositionInForm);
                            } else {
                                this.props.qcInterpretationLongterm(event)
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
                        this.state.isShowLongtermRepeat && !this.state.isLongtermTestHasRepeats ?
                            <td>
                                <button onClick={(event) => {
                                    this.props.repeatLongtermTest(event);
                                    this.setState({ isLongtermTestHasRepeats: true })
                                }} type="button" className="btn btn-sm btn-outline-primary">Repeat</button>
                            </td> :
                            <td style={{ "display": "none" }}></td>
                    }

                    {
                        (this.state.isLongtermTestHasRepeats && !this.props.isMainKit) ||
                            (!this.state.isShowLongtermRepeat && !this.props.isMainKit) ?
                            <td>
                                <button onClick={(event) => {
                                    this.props.deleteRepeatkit(this.state.kitPositionInForm, 'longterm');
                                }} type="button" className="btn btn-sm btn-outline-primary">Delete</button>
                            </td> :
                            <td style={{ "display": "none" }}></td>
                    }

                </tr>
            </React.Fragment>
        );
    }

}

export default LongtermKit;
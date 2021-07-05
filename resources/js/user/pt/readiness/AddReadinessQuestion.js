import React from 'react';

class AddReadinessQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            answerOptions: '',
            answerType: '',
            qustionPosition: 1,
            qustionType: '',
            showErrorMessage: false,
            errorMessage: '',
            qustion: ''
        }

        this.qustionAnswerOptionsHandler = this.qustionAnswerOptionsHandler.bind(this);
        this.qustionAnswerTypeHandler = this.qustionAnswerTypeHandler.bind(this);
        this.qustionTypeHandler = this.qustionTypeHandler.bind(this);
        this.qustionPositionHandler = this.qustionPositionHandler.bind(this);
        this.addReadinessQuestion = this.addReadinessQuestion.bind(this);
        this.questionHandler = this.questionHandler.bind(this);

    }

    componentDidMount() {

    }

    qustionAnswerOptionsHandler(answerOptions) {
        this.setState({ answerOptions: answerOptions });
    }

    qustionAnswerTypeHandler(answerType) {
        this.setState({ answerType: answerType });
    }

    qustionTypeHandler(qustionType) {
        this.setState({ qustionType: qustionType });
    }

    qustionPositionHandler(qustionPosition) {
        this.setState({ qustionPosition: qustionPosition });
    }

    questionHandler(qustion) {
        this.setState({ qustion: qustion });
    }

    addReadinessQuestion() {

        if (this.state.answerOptions == '' ||
            this.state.answerType == '' ||
            this.state.qustion == '' ||
            this.state.qustionPosition == '' ||
            this.state.qustionType == '') {
            this.setState({
                showErrorMessage: true,
                errorMessage: "Kindly fill all fields marked *"
            })
        } else {
            let readiness = {};
            readiness['answerOptions'] = this.state.answerOptions;
            readiness['answerType'] = this.state.answerType;
            readiness['qustionPosition'] = this.state.qustionPosition;
            readiness['qustionType'] = this.state.qustionType;
            this.setState({
                showErrorMessage: false,
                errorMessage: ''
            });
            $('#addQuestionModal').modal('toggle');
            this.props.addReadinessQuestion(readiness);
        }

    }

    render() {
        return (
            <React.Fragment>

                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addQuestionModalTitle">New Checklist Question</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    {this.state.showErrorMessage ? <div className="alert alert-danger" role="alert">
                        {this.state.errorMessage}
                    </div> : ''}

                    <div className="modal-body">

                        <div className="form-group">
                            <label htmlFor="qst_question">Question *</label>
                            <textarea
                                onChange={(event) => this.questionHandler(event.target.value)}
                                value={this.state.question}
                                className="form-control" id="qst_question" aria-describedby="emailHelp" placeholder="Readiness question" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="qst_position">Position *</label>
                            <input onChange={(event) => this.qustionPositionHandler(event.target.value)} type="number"
                                min={+this.state.qustionPosition + +1} //convert to unary ie number
                                value={this.state.qustionPosition}
                                className="form-control"
                                id="qst_position"
                                placeholder="Password" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="qst_type">Question type *</label>
                            <select onChange={(event) => this.qustionTypeHandler(event.target.value)}
                                value={this.state.qustionType} className="custom-select" id="qst_type">
                                <option selected>Choose...</option>
                                <option value="1">Question</option>
                                <option value="2">Comment</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="qst_answer">Answer type *</label>
                            <select onChange={(event) => this.qustionAnswerTypeHandler(event.target.value)}
                                value={this.state.qustionAnswerType}
                                className="custom-select" id="qst_answer">
                                <option selected>Choose...</option>
                                <option value="free">Free text</option>
                                <option value="list">List (e.g. yes,no,invalid)</option>
                                <option value="number">Number</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="qst_answer_options">List answer options *</label>
                            <input onChange={(event) => this.qustionAnswerOptionsHandler(event.target.value)}
                                value={this.state.answerOptions}
                                type="text" className="form-control" id="qst_answer_options" aria-describedby="emailHelp" placeholder="eg yes,no " />
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={() => {
                            this.addReadinessQuestion();
                        }} className="btn btn-info" >Save</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>

            </React.Fragment>
        );
    }

}

export default AddReadinessQuestion;

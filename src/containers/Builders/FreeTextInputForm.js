import React, {Component} from "react";
import {connect} from "react-redux";
import {incrementExerciseCounter} from "../../store/actions/increment_counter";
import {addNewExercise, editExercise} from "../../store/actions/exercises";
import {FormattedMessage} from 'react-intl';
import {
    QUESTION,
    FINISH_EXERCISE,
    TITLE_OF_EXERCISE,
    NEXT_QUESTION,
    PREVIOUS_QUESTION,
    TEST_EXERCISE,
    TITLE_ERROR,
    QUESTION_ERROR,
    ANSWER_ERROR,
    ENTER_ANSWER,
    FREE_TEXT_INPUT,
    ANSWER
} from "../translation";
import {withRouter} from "react-router-dom"
import "../../css/FreeTextInputForm.css";
import withMultimedia from '../../components/WithMultimedia';

class FreeTextInputForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            id: -1,
            title: '',
            noOfQuestions: 0,
            currentQuestionNo: 1,
            questions: [],
            scores: [],
            times: [],
            isFormValid: false,
            errors: {
                question: false,
                answers: false,
                title: false
            },
            currentQuestion: {
                id: 1,
                question: "",
                answer: "",
            }
        };
    }

    // in case of edit load the exercise
    componentDidMount() {
        if (this.props.location.state) {
            const {id, title, questions, scores, times} = this.props.location.state.exercise;
            const currentQuestion = questions[0];
            this.setState({
                ...this.state,
                id: id,
                title: title,
                edit: true,
                isFormValid: true,
                questions: questions,
                scores: scores,
                times: times,
                noOfQuestions: questions.length,
                currentQuestion: {
                    id: currentQuestion.id,
                    question: currentQuestion.question,
                    answer: currentQuestion.answer
                }
            });
        }
    }

    handleChangeAns = e => {
       
        let ans = e.target.value;
        let error = false;
        if (e.target.value === '') {
            error = true;
        }
        this.setState({
            ...this.state,
            currentQuestion: {...this.state.currentQuestion, answer: ans},
            errors: {
                ...this.state.errors,
                answers: error
            }
        }, () => {
            this.checkFormValidation();
        });
    };

    handleChangeTitle = e => {
        let error = false;
        if (e.target.value === '') {
            error = true;
        }
        this.setState({
            ...this.state,
            title: e.target.value,
            errors: {
                ...this.state.errors,
                title: error
            }
        }, () => {
            this.checkFormValidation();
        });
    };

    handleChangeQues = e => {
        let error = false;
        if (e.target.value === '') {
            error = true;
        }
        this.setState({
            ...this.state,
            errors: {
                ...this.state.errors,
                question: error
            },
            currentQuestion: {
                ...this.state.currentQuestion,
                question: e.target.value
            }
        }, () => {
            this.checkFormValidation();
        });
    };

    
    handleNewEvent = event => {
        event.preventDefault();
    };

    // save current question
    saveCurrentForm = () => {
        this.checkFormValidation();

        if (this.state.isFormValid) {
            const {currentQuestionNo, noOfQuestions} = this.state;
            const {question, answer} = this.state.currentQuestion;

            let id = currentQuestionNo;

            let Ques = {
                id: id,
                answer: answer,
                question: question
            };

            if (currentQuestionNo > noOfQuestions) {
                this.setState({
                    ...this.state,
                    questions: [
                        ...this.state.questions,
                        Ques
                    ],
                    
                    noOfQuestions: id,
                    currentQuestionNo: id + 1,
                    isFormValid: false,
                    currentQuestion: {
                        id: id + 1,
                        question: '',
                        answer: '',
                    }
                });
            }
            else {
                const {questions} = this.state;
                let index = currentQuestionNo;

                const updatedQuestions = questions.map((ques, i) => (
                    ques.id === index ? Ques : ques
                ));
                if (currentQuestionNo === noOfQuestions) {
                    this.setState({
                        ...this.state,
                        questions: updatedQuestions,
                        currentQuestionNo: currentQuestionNo + 1,
                        isFormValid: false,
                        currentQuestion: {
                            id: currentQuestionNo + 1,
                            question: '',
                            answer: '',
                        }
                    });
                } else {
                    const {question, answer} = this.state.questions[index];

                    this.setState({
                        ...this.state,
                        questions: updatedQuestions,
                        currentQuestionNo: index + 1,
                        isFormValid: false,
                        currentQuestion: {
                            id: index + 1,
                            question: question,
                            answer: answer
                        }
                    }, () => {

                    });
                }
            }
        }
    };

    // check if current form is valid
    checkFormValidation = () => {
        const {currentQuestion, title} = this.state;
        const {question, answer} = currentQuestion;
        let isFormValid = true;

        if (question === '') {
            isFormValid = false;
        }

        if (title === '') {
            isFormValid = false;
        }

        if (answer === '') {
            isFormValid = false;
        }
       
        this.setState({
            ...this.state,
            isFormValid: isFormValid
        });
    };

    // submit exercise
    submitExercise = (bool,e) => {
        e.preventDefault();
        const {srcThumbnail, userLanguage} = this.props;

        let id = this.state.id;
        if (this.state.id === -1) {
            id = this.props.counter;
        }

        let exercise = {
            title: this.state.title,
            id: id,
            type: "FREE_TEXT_INPUT",
            questions: this.state.questions,
            scores: this.state.scores,
            times: this.state.times,
            thumbnail: srcThumbnail,
            userLanguage: userLanguage
        };

        if (this.state.edit) {
            this.props.editExercise(exercise);
        } else {
            this.props.addNewExercise(exercise);
            this.props.incrementExerciseCounter();
        }

        if(bool)
            this.props.history.push('/play/freeText', {exercise: exercise, edit: true});
        else
            this.props.history.push('/');
    }
    
    // move to previous question
    previousQues = () => {
        const {currentQuestionNo} = this.state;
        let previousQuestionNo = currentQuestionNo - 1;

        let previousQuestion = this.state.questions[previousQuestionNo - 1];
        const {id, question, answer} = previousQuestion;
        let currentQuestion = {
            id: id,
            question: question,
            answer: answer
        };

        this.setState({
            ...this.state,
            currentQuestionNo: id,
            currentQuestion: currentQuestion
        })
    };

    render() {
        const {currentQuestion, errors} = this.state;
        const {id} = currentQuestion;
        let placeholder_string = ENTER_ANSWER; 

        let title_error = '';
        let question_error = '';
        let answer_error = '';

        if (errors['title']) {
            title_error = <span style={{color: "red"}}><FormattedMessage id={TITLE_ERROR}/></span>;
        }
        if (errors['question']) {
            question_error = <span style={{color: "red"}}><FormattedMessage id={QUESTION_ERROR}/></span>;
        }
        if (errors['answers']) {
            answer_error = <span style={{color: "red"}}><FormattedMessage id={ANSWER_ERROR}/></span>;
        }

        return (
            <div className="container">
            <div className="container-fluid">
                <div className="row align-items-center justify-content-center">
                    <div className="col-sm-10">
                        <div>
                            <p><strong><FormattedMessage id={FREE_TEXT_INPUT}/></strong></p>
                            <hr className="my-3"/>
                            <div className="col-md-12">
                                <form onSubmit={this.handleNewEvent}>
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="title"><FormattedMessage id={TITLE_OF_EXERCISE}/></label>
                                            <input
                                                className="input-freeText"
                                                type="text"
                                                id="title"
                                                required
                                                value={this.state.title}
                                                onChange={this.handleChangeTitle}
                                            />
                                            {title_error}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="question">{id}. <FormattedMessage id={QUESTION}/>:</label>
                                            <textarea
                                                className="input-freeText"
                                                rows="4"
                                                id="question"
                                                required
                                                value={this.state.currentQuestion.question}
                                                onChange={this.handleChangeQues}
                                            />
                                            {question_error}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="answer"><FormattedMessage id={ANSWER}/>:</label>
                                            <FormattedMessage id={placeholder_string}>
                                                {placeholder => <input
                                                    className="answers input-ans"
                                                    name={`answer`}
                                                    type="text"
                                                    value={this.state.currentQuestion.answer}
                                                    required
                                                    placeholder={placeholder}
                                                    onChange={this.handleChangeAns}/>}
                                            </FormattedMessage>
                                            {answer_error}
                                        </div>
                                    </div>
                                    <div className="form-group row justify-content-between">
                                        <button
                                            onClick={this.previousQues}
                                            className={"btn button-previous"}
                                            disabled={this.state.currentQuestionNo === 1}
                                        >
                                            <FormattedMessage id={PREVIOUS_QUESTION}/>
                                        </button>
                                        <div className="justify-content-end">
                                            <button
                                                onClick={this.saveCurrentForm}
                                                className={"btn button-next"}
                                                disabled={!this.state.isFormValid}
                                            >
                                                <FormattedMessage id={NEXT_QUESTION}/>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group row justify-content-between">
                                        <button
                                            onClick={(e)=>this.submitExercise(false,e)}
                                            className={"btn button-finish"}
                                            disabled={!this.state.noOfQuestions >= 1}
                                        >
                                            <FormattedMessage id={FINISH_EXERCISE}/>
                                        </button>
                                        <button
                                            onClick={(e)=> this.submitExercise(true,e)}
                                            className={"btn button-finish"}
                                            disabled={!this.state.noOfQuestions >= 1}
                                        >
                                            <FormattedMessage id={TEST_EXERCISE}/>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
        </div>
        )
    }

}

function MapStateToProps(state) {
    return {
        counter: state.exercise_counter
    }
}

export default withMultimedia(require('../../images/freetext_input_image.svg'))(withRouter(
    connect(MapStateToProps,
        {addNewExercise, incrementExerciseCounter, editExercise}
    )(FreeTextInputForm)));
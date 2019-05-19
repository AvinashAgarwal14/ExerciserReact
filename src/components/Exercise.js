import React, {Component} from 'react';
import '../css/Exercise.css'
import {FormattedMessage} from 'react-intl';
import {QUESTIONS, BEST_SCORE, MCQ, REORDER_LIST, CLOZE_TEXT, QUESTION_SINGULAR, PLAY, EDIT, DELETE} from "../containers/translation";
import cloze_background from '../images/cloze_image.svg'
import mcq_background from '../images/mcq_image.svg'
import reorder_background from '../images/list_reorder_image.svg'

class Exercise extends Component {

    constructor(props) {
        super(props);
        const {id} = this.props;

        this.state = {
            id: id,
        }

        this.background = {
            'CLOZE':cloze_background,
            'MCQ':mcq_background,
            "REORDER":reorder_background
        }
    }

    // when play button is clicked
    playExercise = () => {
        this.props.onPlay(this.state.id);
    };

    // when edit button is clicked
    editExercise = () => {
        this.props.onEdit(this.state.id);
    };

    // when delete button is clicked
    deleteExercise = () => {
        this.props.onDelete(this.state.id);
    };

    // when shared button is clicked
    shareExercise = () => {
        this.props.onShare(this.state.id, !this.props.shared);
    };

    // when result button is clicked during presence
    result = () => {
        this.props.presenceResult(this.state.id)
    };

    render() {
        const {title, type, questions, scores, answers, list, isShared, isHost, shared, thumbnail} = this.props;

        let highest = 0;
        if (scores.length > 0) {
            scores.forEach(score => {
                if (highest < score){
                    highest = score;
                }
            });
        }

    
        let play = (<FormattedMessage id={PLAY} defaultMessage={PLAY}>
                        {(msg) => (<button type="button" title={msg} className="play-button" onClick={this.playExercise}/>)}
                    </FormattedMessage>);
        let edit = (<FormattedMessage id={EDIT} defaultMessage={EDIT}>
                        {(msg) => (<button type="button" title={msg} disabled={shared} className="edit-button" onClick={this.editExercise}/>)}
                    </FormattedMessage>);
        let cross = (<FormattedMessage id={DELETE} defaultMessage={DELETE}>
                        {(msg) => (<button type="button" title={msg} disabled={shared} className="delete-button float-right" onClick={this.deleteExercise}/>)}
                    </FormattedMessage>);

        let share = "";
        let results = "";

        if (isShared && !isHost) {
            edit = "";
            cross = "";
        }

        if (isShared && isHost) {
            let bg = "non-shared-exercise";
            if (shared) {
                bg = "shared-exercise";
                results = (<button type="button" className={"result-button"} onClick={this.result}/>);
            }
            share = (<button type="button" className={"share-button " + bg} onClick={this.shareExercise}/>);
        }


        let length = 0;
        let localized_type="";

        if (type === "MCQ") {
            length = questions.length;
            localized_type= MCQ;
        }
        if (type === "CLOZE") {
            length = answers.length;
            localized_type= CLOZE_TEXT;
        }
        if (type === "REORDER") {
            length = list.length;
            localized_type= REORDER_LIST;
        }

        let question_string=(<FormattedMessage id={QUESTIONS} values={{number: length}}/>);
        if(length===1) question_string=(<FormattedMessage id={QUESTION_SINGULAR} values={{number: length}}/>);

        return (
            <div className="col-md-10">
                <div className="card">
                    <div className="card-img-container">
                        <div className="card-img-top" style={{backgroundImage: `url(${thumbnail!==''?thumbnail:this.background[type]})`}}/>
                    </div>
                    <div className="card-body">
                        <h3 className="card-title">{title}</h3>
                        <div><strong><FormattedMessage id={localized_type}/></strong></div>
                        <p className="card-text">
                            <div className="exercise-card-question">{question_string}</div>
                            <div className="exercise-card-hiscore"><FormattedMessage id={BEST_SCORE}/>: {highest}/{length}</div>
                        </p>
                        <div className="buttons">
                            {play}
                            {edit}
                            {cross}
                            {share}
                            {results}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Exercise;
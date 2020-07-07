import React from 'react';
import PropTypes from 'prop-types';

import RadioButtonContainer from '../radioButton/radioButtonContainer/RadioButtonContainer';
import HelpImage from '../helpImage/HelpImage';
import HelpText from '../helpText/HelpText';
import WordInput from '../wordInput/WordInput';
import Button from '../button/Button';
import AudioComponent from '../audioComponent/AudioComponent';
import Word from '../../../utils/spacedRepetition/Word';

const CardContent = (props) => {
  const {
    helpSettings: { isImageShow },
    settings: {
      isShowAnswerBtn, isDeleteBtn, isComplexityBtn,
    },
    isPrevWord,
    word,
    isCorrect,
    isShowBtnClick,
    isAgainBtnClick,
    onCardBtnClick,
    onWordComplexityBtnClick,
  } = props;

  const complexity = word.getDifficulty();

  const ShowAnswerBtn = (
    <Button
      id="showWord"
      label="Answer"
      isDisabled={isCorrect || isShowBtnClick}
      clickHandler={(id) => onCardBtnClick(id)}
    />
  );

  const DeleteBtn = (
    <Button
      id="deleteWord"
      clickHandler={(id) => onCardBtnClick(id)}
    />
  );

  const AgainBtn = (
    <Button
      isDisabled={isAgainBtnClick}
      id="againWord"
      clickHandler={(id) => onCardBtnClick(id)}
    />
  );

  const radioButtons = [
    { label: 'hard', id: 'hard' },
    { label: 'normal', id: 'normal' },
    { label: 'easy', id: 'easy' },
  ];

  const complexityButtons = (
    <div className="card-controls__buttons">
      {AgainBtn}
      <RadioButtonContainer
        items={radioButtons}
        onChange={onWordComplexityBtnClick}
        checkedItem={complexity}
        isAttention={isCorrect || isShowBtnClick}
      />
    </div>
  );

  return (
    <div className="card-content">
      <div className="help-content">
        {isImageShow && <HelpImage {...props} />}
        <HelpText {...props} />
      </div>
      <div className="card-controls">
        {isComplexityBtn && !isPrevWord && isCorrect && complexityButtons}
        <div className="card-controls__buttons">
          {isDeleteBtn && !isPrevWord && DeleteBtn}
          {isShowAnswerBtn && !isPrevWord && ShowAnswerBtn}
          <AudioComponent {...props} />
        </div>
      </div>
      <div className="learn-content">
        <WordInput {...props} />
      </div>
    </div>
  );
};

export default CardContent;

CardContent.propTypes = {
  word: PropTypes.instanceOf(Word).isRequired,
  settings: PropTypes.shape({
    isShowAnswerBtn: PropTypes.bool.isRequired,
    isDeleteBtn: PropTypes.bool.isRequired,
    isComplexityBtn: PropTypes.bool.isRequired,
  }).isRequired,
  helpSettings: PropTypes.shape({
    isImageShow: PropTypes.bool.isRequired,
  }).isRequired,
  isCorrect: PropTypes.bool.isRequired,
  isPrevWord: PropTypes.bool.isRequired,
  isShowBtnClick: PropTypes.bool.isRequired,
  isAgainBtnClick: PropTypes.bool.isRequired,
  onCardBtnClick: PropTypes.func.isRequired,
  onWordComplexityBtnClick: PropTypes.func.isRequired,
};

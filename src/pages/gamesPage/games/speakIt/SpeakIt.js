import React, { useState, useEffect, useRef } from 'react';
import {
  Header, Icon, Image,
} from 'semantic-ui-react';
import update from 'react-addons-update';

import { ProgressBar, Step } from 'react-step-progress-bar';
import ShadowContainer from '../../../../components/containerWithShadow/ContainerWithShadow';
import RadioButton from '../../../../components/radioButton/radioButtonContainer/RadioButtonContainer';
import Button from '../../../../components/button/Button';

import TestImage from '../../../../assets/image/speakIt.png';
import { getWords } from '../../../../controllers/words/words';
import Dictaphone from '../../../../components/dictaphone/Dictaphone';

import option from './gameOption';

import './speakIt.scss';
import 'react-step-progress-bar/styles.css';

const gitDataUrl = 'https://raw.githubusercontent.com/kaxaru/rslang-data/master/';

const stepPic = [
  'https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/9d/Pichu.png/revision/latest?cb=20170407222851',
  'https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/97/Pikachu_%28Smiling%29.png/revision/latest?cb=20170410234508',
  'https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png',
  'https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png',
  'https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png',
  'https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png',
];

const isEmpty = (obj) => Object.keys(obj).length === 0;

/* const defaultParams = {
  StepCounter: 6,
  Words: 5,
};
*/

/* const defGameOption = {
  curStage: 0,
  maxStage: option.StepCounter - 1,
  stagesOption: [],
}; */

const shuffleArray = (arr) => arr.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);

const SpeackIt = () => {
  const [gameScreen, setGameScreen] = useState({
    startScreen: true,
    game: false,
    statistic: false,
  });
  const [gameOption, setGameOption] = useState(null);
  const [activeWord, setActiveWord] = useState(null);
  const [activeWordParams, setActiveWordParams] = useState(null);
  const [activeWordStatistic, setActiveWordStatistic] = useState(null);
  const [gameMode, setGameMode] = useState(false);
  const [userRecWord, setUserRecWord] = useState(null);
  const [gameplayWords, setGamePlayWords] = useState({ errors: {}, rights: {} });
  const [isStatusMic, setStatusMic] = useState(false);
  const [level, setLevel] = useState(null);
  const input = useRef(null);

  useEffect(() => {
    const getWordsForStage = () => {
      const getWordsPromises = [];
      for (let stage = 0; stage <= gameOption.StepCounter - 1; stage += 1) {
        getWordsPromises.push(getWords(gameOption.curStage, stage, true));
      }
      let newGameOption = {};
      Promise.all(getWordsPromises).then((resps) => {
        resps.forEach((resp, index) => {
          const words = resp.data;
          const stagesOption = {};
          const items = shuffleArray(words).slice(words.length - gameOption.Words);
          stagesOption[`stage${index}`] = items;
          newGameOption.stagesOption = newGameOption.stagesOption || gameOption.stagesOption;
          newGameOption = {
            ...gameOption,
            stagesOption: [...newGameOption.stagesOption, stagesOption],
          };
        });
        setGameOption(newGameOption);
      });
    };

    if (level !== null && Array.isArray(gameOption?.stagesOption) && !gameOption?.stagesOption.length) {
      getWordsForStage();
    }
  });

  useEffect(() => {
    const activeEl = document.querySelector(`.speakIt .item-content[data-value=${activeWord}]`);
    if (activeEl !== null) {
      const wordParams = {
        value: activeEl.getAttribute('data-value'),
        translate: activeEl.getAttribute('data-translate'),
        image: activeEl.getAttribute('data-image'),
        audio: activeEl.getAttribute('data-audio'),
      };
      setActiveWordParams(wordParams);
    }
  }, [activeWord]);

  useEffect(() => {
    if (activeWordParams !== null && !gameMode) {
      const audio = document.querySelector('.speakIt-audio');
      audio.play();
    }
  }, [activeWordParams, gameMode]);

  useEffect(() => {
    if (gameMode) {
      const newGamePlayWords = {
        errors: update({}, { $merge: gameOption?.stagesOption }),
        rights: {},
      };
      setGamePlayWords(newGamePlayWords);
    } else {
      setGamePlayWords({ errors: {}, rights: {} });
      setActiveWordStatistic(null);
    }
  }, [gameMode, gameOption?.stagesOption]);

  useEffect(() => {
    if (gameOption === null) return undefined;
    const { errors } = gameplayWords;
    let { rights } = gameplayWords;
    const { curStage } = gameOption;
    if (!gameMode || userRecWord === null) {
      return undefined;
    }

    if (isEmpty(errors)) {
      return undefined;
    }

    const words = errors[curStage][`stage${curStage}`];
    const wordIndex = words.findIndex((el) => el.word === userRecWord);
    if (wordIndex >= 0) {
      if (isEmpty(rights)) {
        const newRights = Array.from({ length: option.StepCounter }, (v, k) => k).map((el) => {
          const obj = {};
          obj[`stage${el}`] = [];
          return obj;
        });
        rights = newRights;
      }

      rights[curStage][`stage${curStage}`].push(words[wordIndex]);
      const newErrorsWord = [...words.slice(0, wordIndex), ...words.slice(wordIndex + 1)];
      const cStage = {};
      cStage[`stage${curStage}`] = newErrorsWord;
      const newErrorsState = update({}, { $merge: errors });
      newErrorsState[curStage] = cStage;
      setGamePlayWords({
        errors: newErrorsState,
        rights,
      });
    }
    return undefined;
  }, [userRecWord, gameplayWords, gameMode, gameOption]);

  const isMicOff = (isPlay) => {
    const micIcon = document.querySelector('.input-wrapper .microphone');
    if (micIcon !== null && !isPlay) {
      micIcon.click();
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (gameMode) {
      setStatusMic(gameMode);
    }
    isMicOff(gameMode);
  }, [gameMode]);

  useEffect(() => {
    if (activeWordStatistic !== null) {
      const audio = document.querySelector('.speakIt-results__audio');
      audio.play();
    }
  }, [activeWordStatistic]);

  useEffect(() => {
    if (gameOption === null) return undefined;
    const { rights } = gameplayWords;
    const { curStage } = gameOption;
    if (!isEmpty(rights)) {
      const rightWords = rights[curStage][`stage${curStage}`];
      rightWords.forEach((r) => {
        const el = document.querySelector(`.item[data-value=${r.word}]`);
        el.classList.add('success');
      });
    }
    return undefined;
  }, [gameplayWords, gameOption]);

  const removeGameModeClass = () => {
    const els = [...document.querySelectorAll('.speakIt-items .item.success')];
    if (els.length > 0) {
      els.forEach((e) => {
        e.classList.remove('success');
      });
    }
  };

  const restart = () => {
    if (gameScreen.statistic) {
      const screen = {
        startScreen: true,
        game: false,
        statistic: false,
      };
      setGameScreen(screen);
      setGameOption(null);
      setLevel(null);
    }
    setGameMode(false);
    removeGameModeClass();
    setActiveWord(null);
    setActiveWordParams(null);
  };

  const start = () => {
    if (gameMode) {
      removeGameModeClass();
    }
    setGameMode(!gameMode);
  };

  const switchStage = (e) => {
    if (e.target.nodeName === 'IMG') {
      const cStep = e.target.getAttribute('data-step');
      const newGameOption = {
        ...gameOption,
        curStage: cStep,
      };
      setGameOption(newGameOption);
    }
    return false;
  };

  const buildProgressStep = () => {
    if (gameOption === null) {
      return null;
    }
    const stepSize = Array.from({ length: gameOption.StepCounter }, (v, k) => k);
    const stepEls = stepSize.map((s, index) => (
      <Step transition="scale" key={s}>
        {({ accomplished }) => (
          <img
            style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
            width="30"
            src={stepPic[index]}
            data-step={index}
            alt=""
          />
        )}
      </Step>
    ));
    return (
      <ProgressBar
        percent={(gameOption.curStage * 100) / (gameOption.StepCounter - 1)}
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
      >
        {stepEls}
      </ProgressBar>
    );
  };

  const onClickSetWord = (e) => {
    const item = e.currentTarget;
    const word = item.querySelector('.item-content');
    setActiveWord(word.getAttribute('data-value'));
  };

  const isActiveItemClass = (cWord, index) => {
    if (cWord === null) return '';
    if (!gameMode && cWord[index]?.word === activeWord) {
      return 'active';
    }
    return '';
  };

  const getSpeechQuery = (value) => {
    setUserRecWord(value.toLocaleLowerCase());
  };

  const getStatusMic = (status) => (status === 'microphone' ? setStatusMic(true) : setStatusMic(false));

  const isImageDescription = () => {
    if (!isStatusMic && !gameMode) {
      return (
        <p>{activeWordParams?.translate}</p>
      );
    }
    return (
      <div className="input-wrapper">
        <input icon="microphone" readOnly ref={input} />
        <Dictaphone getSpeechQuery={getSpeechQuery} setInputValue={input} getStatusMic={getStatusMic} />
      </div>
    );
  };

  const buildWordEl = () => {
    if (gameOption === null) {
      return null;
    }
    const wordSize = Array.from({ length: gameOption.Words }, (v, k) => k);
    let words = null;
    if (Array.isArray(gameOption.stagesOption) && gameOption.stagesOption.length) {
      const curStageWords = gameOption.stagesOption[gameOption.curStage];
      words = curStageWords[`stage${[gameOption.curStage]}`];
    }
    const wordEl = wordSize.map((w) => (
      <div
        className={`${isActiveItemClass(words, w)} item`}
        key={w}
        onClick={onClickSetWord}
        data-value={words !== null ? words[w].word : null}
        role="presentation"
      >
        <div className="item-icon">
          <Icon name="assistive listening systems" />
        </div>
        <div
          className="item-content"
          data-value={words !== null ? words[w].word : null}
          data-translate={words !== null ? words[w].wordTranslate : null}
          data-image={words !== null ? words[w].image : null}
          data-audio={words !== null ? words[w].audio : null}
        >
          <p>{words !== null ? words[w].word : null}</p>
          <p>{words !== null ? words[w].transcription : null}</p>
        </div>
      </div>
    ));
    return <>{wordEl}</>;
  };

  const VoiceStatistic = (e) => {
    const activeEl = e.currentTarget;
    const wordParams = {
      value: activeEl.getAttribute('data-value'),
      translate: activeEl.getAttribute('data-translate'),
      audio: activeEl.getAttribute('data-audio'),
    };
    setActiveWordStatistic(wordParams);
  };

  const buildStatistic = (errorEls = true) => {
    if (!gameMode) return null;
    const { errors, rights } = gameplayWords;
    const { curStage } = gameOption;
    if (isEmpty(errors) && isEmpty(rights)) return null;
    if (errorEls && !isEmpty(errors)) {
      const stage = errors[curStage];
      const words = stage[`stage${curStage}`];
      const wordsErr = words.map((w) => (
        <div
          role="presentation"
          className="result-item"
          key={w.word}
          data-value={w.word}
          data-audio={w.audio}
          data-translate={w.wordTranslate}
          onClick={VoiceStatistic}
        >
          <div className="item-icon">
            <Icon name="assistive listening systems" />
          </div>
          <p>{w.word }</p>
          <p>{w.transcription }</p>
        </div>
      ));
      return (
        <>
          <p className="results-errors">
            Errors:
            <span className="errors-num">{words.length}</span>
          </p>
          {wordsErr}

        </>
      );
    }
    if (!errorEls && !isEmpty(rights)) {
      const stage = rights[curStage];
      const words = stage[`stage${curStage}`];
      const wordsErr = words.map((w) => (
        <div
          className="result-item"
          key={w.word}
          data-value={w.word}
          data-audio={w.audio}
          onClick={VoiceStatistic}
          data-translate={w.wordTranslate}
          role="presentation"
        >
          <div className="item-icon">
            <Icon name="assistive listening systems" />
          </div>
          <p>{w.word }</p>
          <p>{w.transcription }</p>
        </div>
      ));
      return (
        <>
          <p className="results-right">
            Rights:
            <span className="right-num">{words.length}</span>
          </p>
          {wordsErr}
        </>
      );
    }
    return null;
  };

  const getImage = () => {
    if (activeWordParams === null) return TestImage;
    return `${gitDataUrl}${activeWordParams.image}`;
  };

  const resultPage = () => {
    const screen = {
      startScreen: false,
      game: false,
      statistic: true,
    };
    setGameScreen(screen);
    if (isStatusMic) {
      isMicOff(false);
    }
  };

  const backToMain = () => {
    const screen = {
      startScreen: false,
      game: true,
      statistic: false,
    };
    setGameScreen(screen);
    if (!isStatusMic) {
      isMicOff(false);
    }

    setActiveWordStatistic(null);
  };

  const redirectToGame = () => {
    const screen = {
      startScreen: false,
      game: true,
      statistic: false,
    };
    setGameOption(option[level]);
    setGameScreen(screen);
  };

  const setLevelType = (e, type) => {
    if (type === level) {
      setLevel(null);
    } else {
      setLevel(type);
    }
  };

  return (
    <>
      <div className={`speakIt startScreen ${gameScreen.startScreen ? 'visible' : 'invisible'}`}>
        <ShadowContainer>
          <div
            className="speakIt-gamelevel"
          >
            <RadioButton
              className="speakIt-level level-default"
              items={['easy', 'normal', 'hard']}
              onChange={setLevelType}
            />
          </div>

          <Button label="Start game" clickHandler={redirectToGame} isDisabled={level === null}> </Button>
        </ShadowContainer>
      </div>
      <div className={`speakIt ${gameScreen.game ? 'visible' : 'invisible'}`}>
        <div className="speakIt-header">
          <Header as="h2" className="games-header">
            <Icon name="game" />
            <Header.Content>SpeakIt</Header.Content>
          </Header>
        </div>
        <div className="app-speakIt" />
        <div className="speakIt-progressbar" onClick={switchStage} role="presentation">
          {buildProgressStep()}
        </div>
        <div className="speakIt-image__wrapper">
          <Image src={getImage()} size="medium" bordered alt="" />
          {isImageDescription()}
        </div>
        <div className="speakIt-items">
          {buildWordEl()}
        </div>
        <div className="speakIt-panel">
          <Button label="Restart" clickHandler={restart} />
          <Button label={gameMode ? 'Learn' : 'Speak'} clickHandler={start} />
          {gameMode ? <Button label="Results" clickHandler={resultPage} /> : null}
        </div>
        {gameMode ? null : (
          <audio
            className="speakIt-audio"
            src={activeWordParams ? `${gitDataUrl}/${activeWordParams?.audio}` : null}
          >
            <track kind="captions" />
          </audio>
        )}
      </div>
      <div className={`speakIt-result ${gameScreen.statistic ? 'visible' : 'invisible'}`}>
        <div className="speakIt-progressbar" onClick={switchStage} role="presentation">
          {buildProgressStep()}
        </div>
        <div className="resultpage">

          <div className="results-container">

            { buildStatistic() }

            { buildStatistic(false) }

            <p className="results-right">
              Rights:
              <span className="right-num">0</span>
            </p>
            <div className="right-item" />
          </div>
        </div>
        <div className="result-button__wrapper">
          <Button label="Start play again?" clickHandler={restart} />
          <Button label="Back" clickHandler={backToMain} />
        </div>
        <audio
          className="speakIt-results__audio"
          src={activeWordStatistic ? `${gitDataUrl}/${activeWordStatistic?.audio}` : null}
        >
          <track kind="captions" />
        </audio>
      </div>
    </>
  );
};

export default SpeackIt;

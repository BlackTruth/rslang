import fetch from 'node-fetch';
// import Word from './Word';
import WordQueue from '../utils/spacedRepetition/WordQueue';
import { getCookie } from '../utils/cookie';
import wordQueueSubject from '../utils/observers/WordQueueSubject';
import { makeRequest } from '../utils/responseFromServer';
import signinSubject from '../utils/observers/SignInSubject';
import statisticsController from '../controllers/StatisticsController';
import { getTodaySeconds } from '../utils/time';
import settingsController from '../controllers/SettingsController';
import settingsNames from '../constants/settingsNames';

export default class WordModel {
  constructor() {
    this.wordQueue = null;
  }

  init = async () => {
    if (!this.hasQueueForToday()) {
      const { data: userWords } = await this.queryUserWords();
      const { data: newWords } = await this.queryNewWords();
      this.wordQueue = new WordQueue();
      this.wordQueue.makeQueue(newWords, userWords);
      this.updateStatistics();
    } else {
      this.wordQueue = new WordQueue();
      const { data: words } = await this.getWordsFromSavedQueue();
      this.wordQueue.usePredefinedQueue(statisticsController.get().optional.todayQueue, words);
    }

    wordQueueSubject.notify(this.wordQueue);

    // test
    const words = this.wordQueue.queue.map((queueW) => ({
      word: queueW.word.definition.word,
      phase: queueW.word.repetitionPhase,
      isEducation: queueW.isEducation,
      nextTime: queueW.nextTime,
    }));
  }

  hasQueueForToday = () => {
    const { todayQueue } = statisticsController.get().optional;
    const todaySeconds = getTodaySeconds();
    if (todayQueue) {
      if (todayQueue.queue.length === 0) {
        return false;
      }
      if (todayQueue.date === todaySeconds) {
        return true;
      }
      if (todayQueue.date < todaySeconds && todayQueue.length === todayQueue.queue.length) {
        todayQueue.date = todaySeconds;
        return true;
      }
    }
    return false;
  }

  updateStatistics = async () => {
    statisticsController.updateQueue(this.wordQueue.getQueueToSave());
  };

  /**
   * @param {Word} word
   */
  updateWord = async (word, isNew) => {
    let method = 'PUT';
    if (isNew) {
      method = 'POST';
    }
    const wordToPost = {
      difficulty: `${word.hasUserDifficulty() ? word.getUserDifficulty() : word.getAlgDifficulty()}`,
      optional: {
        difficultyId: word.difficulty,
        time: Math.ceil(word.time / 1000),
        repetitionPhaseId: word.repetitionPhase,
        lastMistake: Math.ceil(word.lastMistake / 1000),
        mistakes: word.mistakes,
        totalMistakes: word.totalMistakes,
        totalRepetition: word.totalRepetition,
        nextRepetition: Math.ceil(word.getNextRepetition().getTime() / 1000),
      },
    };
    if (word.userDifficulty) {
      wordToPost.optional.userDifficultyId = word.userDifficulty;
    }
    const { data, response } = await makeRequest(method, `users/%%userId%%/words/${word.definition.wordId}`, wordToPost);
    if (!response.ok) {
      console.log(data);
      throw new Error(`${method} Word failed with ${response.status} ${response.statusText}`);
    }
    return data;
  };

  queryWords = async (params) => {
    const { data: dataArray, response } = await makeRequest(
      'GET',
      'users/%%userId%%/aggregatedWords',
      undefined,
      params,
    );
    if (!response.ok) {
      throw new Error(`GET Words failed with ${response.status} ${response.statusText}`);
    }
    const [data] = dataArray;
    const words = data.paginatedResults;
    return { data: words, response };
  }

  queryUserWords = async () => {
    const maxNewWords = settingsController.getSettingByName(settingsNames.sections.education, settingsNames.items.newWords);
    const maxWords = settingsController.getSettingByName(settingsNames.sections.education, settingsNames.items.allWords);
    const todaySeconds = getTodaySeconds();
    const params = {
      wordsPerPage: maxWords - maxNewWords,
      filter: JSON.stringify({ $or: [{ 'userWord.optional.nextRepetition': { $lte: todaySeconds } }] }),
    };
    return this.queryWords(params);
  }

  queryNewWords = async () => {
    const maxNewWords = settingsController.getSettingByName(settingsNames.sections.education, settingsNames.items.newWords);
    const params = {
      wordsPerPage: maxNewWords,
      filter: JSON.stringify({ $or: [{ userWord: null }] }),
    };
    return this.queryWords(params);
  }

  getWordsFromSavedQueue = async () => {
    const words = statisticsController.get().optional.todayQueue.queue.map((qWord) => ({ word: qWord.w }));
    const filter = {
      $or: words,
    };
    const params = {
      wordsPerPage: words.length,
      filter: JSON.stringify(filter),
    };
    return this.queryWords(params);
  }

  endQueue = async () => {
    this.wordQueue.endQueue();
    await Promise.all(this.wordQueue.getWords().forEach((word) => this.updateWord(word)));
    await this.updateStatistics();
  }

  reset = () => {
    this.wordQueue = null;
  }
}

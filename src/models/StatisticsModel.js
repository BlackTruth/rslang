import { makeRequest } from '../utils/responseFromServer';
import statisticsSubject from '../utils/observers/StatisticsSubject';
import { getTodaySeconds } from '../utils/time';
import notificationSubject from '../utils/observers/NotificationSubject';

class StatisticsModel {
  constructor() {
    this.statistics = null;
  }

  getFromServer = async () => {
    const { data, response } = await makeRequest('GET', 'users/%%userId%%/statistics');
    if (!response.ok) {
      if (response.status === 404) {
        const putData = { learnedWords: 0, optional: { todayStatistics: {}, todayQueue: {}, longStatistics: {} } };
        const { response: postResponse } = await makeRequest(
          'PUT',
          'users/%%userId%%/statistics',
          putData,
        );
        if (!postResponse.ok) {
          if (!postResponse.status === 401) {
            notificationSubject.notify('cannot get/update data',
              `POST Statisctics failed with ${postResponse.status} ${postResponse.statusText}`);
          }
        } else {
          this.statistics = putData;
          statisticsSubject.notify(this.statistics);
        }
      } else if (!response.status === 401) {
        notificationSubject.notify('cannot get/update data',
          `Get Statisctics failed with ${response.status} ${response.statusText}`);
      }
    } else {
      this.statistics = data;
      if (!this.statistics.optional) {
        this.statistics.optional = {};
      }
      if (!this.statistics.optional.todayStatistics) {
        this.resetTodayStatistics();
      }
      if (!this.statistics.optional.longStatistics) {
        this.statistics.optional.longStatistics = {};
      }
      const todaySec = getTodaySeconds();
      if (!this.statistics.optional.longStatistics[`${todaySec}`]) {
        this.statistics.optional.longStatistics[`${todaySec}`] = 0;
      }
      delete this.statistics.id;
      statisticsSubject.notify(this.statistics);
    }
  };

  resetTodayStatistics = () => {
    this.statistics.optional.todayStatistics = {
      passedWords: 0,
      passedCards: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      currentStrike: 0,
      strike: 0,
    };
  }

  get = () => (this.statistics ? { ...this.statistics } : null);

  save = async ({ todayStatistics, longStatistics, todayQueue }) => {
    const statistics = { ...this.statistics };
    if (!statistics.optional) {
      statistics.optional = {};
    }
    if (todayQueue) {
      statistics.optional.todayQueue = todayQueue;
    }
    if (todayStatistics) {
      statistics.optional.todayStatistics = todayStatistics;
    }
    if (longStatistics) {
      statistics.optional.longStatistics = longStatistics;
    }
    const { response } = await makeRequest(
      'PUT',
      'users/%%userId%%/statistics',
      statistics,
    );
    if (!response.ok) {
      notificationSubject.notify('cannot get/update data',
        `PUT Statistics failed with ${response.status} ${response.statusText}`);
    } else {
      this.statistics = statistics;
      statisticsSubject.notify(this.statistics);
    }
    return this.statistics;
  };

  getPassedCount = () => {
    const { optional: { todayStatistics: { passedWords } } } = this.statistics;
    return passedWords;
  }

  reset = () => {
    this.statistics = null;
  }
}

const statisticsModel = new StatisticsModel();

export default statisticsModel;

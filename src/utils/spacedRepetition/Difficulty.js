export default class Difficulty {
  /**
   * Class to use with Word
   * @param {string} name name of the difficulty phace from new to completed
   * @param {number} maxDays duration of the phase without mistakes
   * @param {number} period repetition period
   */
  constructor(name, maxDays, period) {
    this.name = name;
    this.maxDays = maxDays;
    this.period = period;
  }
}

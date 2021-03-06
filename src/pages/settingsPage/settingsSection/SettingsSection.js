import React from 'react';
import PropTypes from 'prop-types';
import Setting from './settingItem/SettingItem';

import {
  defaultInputRatio, numberPickerMinValue as minValue, numberPickerMaxValue as maxValue,
} from '../../../config/default';

import './SettingsSection.scss';
import settingsWordCountSubject from '../../../utils/observers/SettingWordCountSubject';

const SettingsSection = ({ sectionInfo, handleChange }) => {
  const { sectionName, settingsArr: settingsInfo } = sectionInfo;

  const handleEvents = {
    handleSwitcherToggle(switcherId) {
      const switcher = settingsInfo.find((setting) => setting.name.replace(/\s/g, '-').toLowerCase() === switcherId);
      const isDisablingRequiredSetting = (switcher.isChecked && switcher.isRequired);

      if (isDisablingRequiredSetting) {
        const isLastCheckedRequiredSetting = settingsInfo
          .filter((setting) => setting.isRequired && setting.isChecked)
          .length === 1;

        if (!isLastCheckedRequiredSetting) {
          handleChange(switcherId, sectionName);
        }
      } else {
        handleChange(switcherId, sectionName);
      }
    },

    handleInputChange(newInputValue, inputId) {
      const isValidValue = (minValue <= Number(newInputValue)) && (Number(newInputValue) <= maxValue);

      if (isValidValue) {
        const newSettingsValue = settingsInfo.map((setting) => {
          const settingId = setting.name.replace(/\s/g, '-').toLowerCase();
          const value = (inputId === settingId) ? +newInputValue : setting.value;

          return value;
        });

        const [wordsCount, cardsCount] = newSettingsValue;

        const isValidInputRatio = cardsCount >= (wordsCount + 2) * 5;

        if (isValidInputRatio) {
          handleChange(inputId, sectionName, newInputValue);
          settingsWordCountSubject.notify();
        }
      }
    },
  };

  return (
    <div className={`settings__section settings__section--${sectionName}`}>
      <h3 className="settings__section__title">
        {sectionName.toUpperCase()}
      </h3>
      {settingsInfo.map((settingInfo) => (
        <Setting
          settingInfo={settingInfo}
          settingSectionName={sectionName}
          key={settingInfo.name}
          handleChange={handleEvents}
        />
      ))}
    </div>
  );
};

SettingsSection.propTypes = {
  handleChange: PropTypes.func.isRequired,
  sectionInfo: PropTypes.shape({
    sectionName: PropTypes.string.isRequired,
    settingsArr: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default SettingsSection;

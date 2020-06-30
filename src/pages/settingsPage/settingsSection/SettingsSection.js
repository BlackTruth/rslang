import React from 'react';
import PropTypes from 'prop-types';
import Setting from './settingItem/SettingItem';

import './SettingsSection.scss';

const SettingsSection = ({ sectionInfo, handleChange }) => {
  const { sectionName, settingsArr: settingsInfo } = sectionInfo;

  const handleEvents = {
    handleSwitcherToggle(switcherId) {
      const isDisablingRequiredSetting = (settingsInfo[switcherId - 1].isChecked && settingsInfo[switcherId - 1].isRequired);

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
      const inputSectionName = 'education';
      if (Number(newInputValue) >= 1) {
        handleChange(inputId, inputSectionName, newInputValue);
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
          key={settingInfo.id}
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
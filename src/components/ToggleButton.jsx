import classNames from 'classnames';
import React, { useContext } from 'react';
import SettingsContext from './SettingsContext';

export default ({ value, setValue, label }) => {
  const settings = useContext(SettingsContext)
    return (<button
      className={classNames("tiny ghost", { 'night-mode': settings.isNightMode})}
      onClick={() =>setValue(!value)} >
        {label}: {value ? 'On' : 'Off'}
    </button>)
  }
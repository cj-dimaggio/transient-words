import React from 'react';

const noop = () => undefined;

export default React.createContext({
  isFullScreen: false,
  setFullScreen: noop,
  isNightMode: false,
  setNightMode: noop,
  isSingleLetterMode: false,
  setSingleLetterMode: noop,
  isForgetting: false,
  setForgetting: noop
});

export const useSettings = () => {
  const [isFullScreen, setFullScreen] = React.useState(false);
  const [isNightMode, setNightMode] = React.useState(false);
  const [isSingleLetterMode, setSingleLetterMode] = React.useState(false);
  const [isForgetting, setForgetting] = React.useState(false);

  return {
    isFullScreen,
    setFullScreen,
    isNightMode,
    setNightMode,
    isSingleLetterMode,
    setSingleLetterMode,
    isForgetting,
    setForgetting
  }
}
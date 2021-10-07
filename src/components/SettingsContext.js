import React from 'react';

const noop = () => undefined;

// https://usehooks.com/useLocalStorage/
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];

}

export const useSettings = () => {
  const [isFullScreen, setFullScreen] = React.useState(false);
  const [isNightMode, setNightMode] = useLocalStorage('setting_nightmode', false);
  const [isSingleLetterMode, setSingleLetterMode] = useLocalStorage('setting_singleletter', false);
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
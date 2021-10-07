import React from 'react';
import classNames from 'classnames';
import FullScreen from 'react-full-screen';
import Editor from '../components/Editor';
import Download from '../components/Download';
import SettingsContext, {useSettings} from './SettingsContext';
import ToggleButton from './ToggleButton';


export default () => {
  const [text, setText] = React.useState('');
  const [entries, setEntries] = React.useState([]);
  const settings = useSettings();

  const onTimeUp = (value) => {
    if (!settings.isForgetting) {
      setEntries([...entries, value])
    }
  }

  return (
    <SettingsContext.Provider value={settings}>
      <FullScreen enabled={settings.isFullScreen}>
          <div className={classNames('app', {'night-mode': settings.isNightMode})}>
            <div className="buttons">
              <Download entries={entries} text={text} />
              <ToggleButton value={settings.isSingleLetterMode} setValue={settings.setSingleLetterMode} label="Single Letter Mode"/>
              <ToggleButton value={settings.isForgetting} setValue={settings.setForgetting} label="Forget Entries"/>
              <i className="icon-night-mode" onClick={() => settings.setNightMode(!settings.isNightMode)}></i>
              <i className="icon-fullscreen" onClick={() => settings.setFullScreen(!settings.isFullScreen)}></i>
            </div>

            <div className="content">
              <Editor onTimeUp={onTimeUp} setText={setText} />
            </div>
          </div>
      </FullScreen>
    </SettingsContext.Provider>
  );
}

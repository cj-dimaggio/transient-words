import React from 'react';
import classNames from 'classnames';
import FullScreen from 'react-full-screen';
import Editor from '../components/Editor';
import Download from '../components/Download';

export default () => {
  const [isFullScreen, setFullScreen] = React.useState(false);
  const [isNightMode, setNightMode] = React.useState(false);

  const [entries, setEntries] = React.useState([]);

  return (
    <FullScreen enabled={isFullScreen}>
      <div className={classNames('app', {'night-mode': isNightMode})}>
        <div className="buttons">
          <Download entries={entries} />
          <i className="icon-night-mode" onClick={() => setNightMode(!isNightMode)}></i>
          <i className="icon-fullscreen" onClick={() => setFullScreen(!isFullScreen)}></i>
        </div>
        

        <div className="content">
          <Editor onTimeUp={value => setEntries([...entries, value])} />
        </div>
      </div>
    </FullScreen>
  );
}

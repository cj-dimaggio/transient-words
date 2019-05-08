import React from 'react';
import classNames from 'classnames';
import Fullscreen from "react-full-screen";

import Progress from './Progress';
import WordCount from './WordCount';
import WriteButton from './WriteButton';
import Failure from './Failure';
import Download from './Download';
import Editor from './Editor';
import {AppContext} from './AppContext';

export default class WritingApp extends React.Component {
  constructor(props) {
    super(props);

    let {limit, type, hardcore} = this.props;

    this.handleStroke = this.handleStroke.bind(this);

    this.reset = this.reset.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleNightMode = this.toggleNightMode.bind(this);
    this.now = this.now.bind(this);
    this.editor = React.createRef();

    this.state = {
      run: false,
      startTime: null,
      fullscreen: false,
      nightMode: localStorage.getItem("mdwa.night-mode") === "true",
      progress: 0,
      timeSinceStroke: 0,
      danger: false,
      won: false,
      lost: false,
      fade: 2,
      kill: 5,
      limit: limit,
      type: type,
      hardcore: hardcore,
    };
  }

  startWriting() {
    this.setState({
      run: true,
      startTime: this.now(),
      timerID: setInterval(() => this.tick(), 100),
    })
  }

  toggleNightMode() {
    localStorage.setItem("mdwa.night-mode", !this.state.nightMode);
    this.setState((prevState, props) => ({ nightMode: !prevState.nightMode }));
  }

  toggleFullscreen() {
    this.setState((prevState, props) => ({ fullscreen: !prevState.fullscreen }));
  }

  handleStroke(char, text) {
    if (!this.state.run && !this.state.won) this.startWriting();
    this.toggleDanger(false);
    const words = text.trim().length && text.trim().split(/\s+/).length;
    this.setState({
      text,
      words,
      timeSinceStroke: 0
    });
  }

  stopWriting() {
    clearInterval(this.state.timerID);
  }

  toggleDanger(on) {
    if (this.state.danger === on) return;
    this.setState({danger: on});
  }

  now() {
    return new Date().getTime() / 1000;
  }

  win() {
    this.stopWriting();
    this.setState({
      won: true,
      run: false
    })
  }

  fail() {
    this.stopWriting();
    this.setState({lost: true})
  }

  reset(type, limit, hardcore) {
    this.setState({
      type,
      limit,
      hardcore,
      won: false,
      lost: false,
      run: false,
      startTime: null,
      progress: 0,
      timeSinceStroke: 0,
      danger: false,
      words: 0
    });
    this.editor.current && this.editor.current.reset();
  }

  tick() {
    const {
      run,
      words,
      timeSinceStroke,
      startTime,
      fade,
      type,
      limit,
      kill,
    } = this.state;
    if (!run) return;
    const danger = timeSinceStroke >= fade;
    if (timeSinceStroke >= kill) return this.fail();
    const duration = this.now() - startTime;
    const progress = (type === "minutes" ? duration / 60.0 : words) / limit;
    if (progress >= 1) this.win();

    this.setState((prevState, props) => ({
      words,
      progress,
      danger,
      timeSinceStroke: prevState.timeSinceStroke + 0.1
    }));
  }

  render() {
    const {
      fullscreen,
      danger,
      won,
      lost,
      text,
      nightMode,
      limit,
      type,
      hardcore
    } = this.state;
    const appClass = classNames('app', {
      'night-mode': nightMode,
      danger: danger
    });
    return (
      <Fullscreen enabled={fullscreen} >
        <AppContext.Provider value={this.state}>
          <div className={appClass} >
            <Failure />
            <Progress />
            <div className="buttons">
              {won && <Download text={text} /> }
              <i className="icon-night-mode" onClick={this.toggleNightMode}></i>
              <i className="icon-fullscreen" onClick={this.toggleFullscreen}></i>
            </div>
            {!lost && (
              <div className="content">
                <Editor
                  ref={this.editor}
                  won={won}
                  onStroke={this.handleStroke}
                  onNightMode={this.toggleNightMode}
                  onFullScreen={this.toggleFullscreen}
                />
                {
                  won
                  ? <WriteButton small ghost hidePanel label="Start Again" {...{limit, type, hardcore}} />
                  : <WordCount />
                }
              </div>
            )}
          </div>
        </AppContext.Provider>
      </Fullscreen>
    );
  }
}

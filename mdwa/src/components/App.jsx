import React, { Component } from 'react';
import classNames from 'classnames';
import Fullscreen from "react-full-screen";

import Progress from './Progress';
import WordCount from './WordCount';
import WriteButton from './WriteButton';
import Failure from './Failure';
import Download from './Download';
import Editor from './Editor';

export default class WritingApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      run: false,
      startTime: null,
      fullscreen: false,
      nightMode: false,
      progress: 0,
      timeSinceStroke: 0,
      danger: false,
      won: false,
      lost: false,
      fade: .1,
      kill: 1,
      limit: this.props.limit,
      type: this.props.type,
      hardcore: this.props.hardcore
    };

    this.handleStroke = this.handleStroke.bind(this);

    this.reset = this.reset.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleNightMode = this.toggleNightMode.bind(this);
    this.now = this.now.bind(this);
    this.editor = React.createRef();
  }

  startWriting() {

    this.setState({
      run: true,
      startTime: this.now(),
      timerID: setInterval(() => this.tick(), 100),
    })
  }

  toggleNightMode() {
    this.setState((prevState, props) => ({ nightMode: !prevState.nightMode }));
  }

  toggleFullscreen() {
    this.setState((prevState, props) => ({ fullscreen: !prevState.fullscreen }));
  }

  handleStroke(char, text) {
    if (!this.state.run && !this.state.won) this.startWriting();
    this.toggleDanger(false);
    const words = text.split(/\s+/).length;
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
    console.log("try again")
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
    const progress = (type === "timed" ? duration / 60.0 : words) / limit;
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
      progress,
      danger,
      won,
      lost,
      limit,
      type,
      words,
      text,
      nightMode
    } = this.state;
    const appClass = classNames('app', {
      'night-mode': nightMode,
      danger: danger
    });
    return (
      <Fullscreen enabled={fullscreen} >
        <div className={appClass} >
          <Failure active={lost} words={words} limit={limit} type={type} onReset={this.reset}/>
          <Progress progress={progress} won={won} danger={danger} />
          <div className="buttons">
            {won && <Download count={words} text={text} /> }
            <i className="icon-night-mode" onClick={this.toggleNightMode}></i>
            <i className="icon-fullscreen" onClick={this.toggleFullscreen}></i>
          </div>
          {!lost && (
            <div className="content">
              <Editor ref={this.editor} won={won} onStroke={this.handleStroke} onNightMode={this.toggleNightMode} />
              {
                won
                ? <WriteButton small ghost label="Start Again" onSubmit={this.reset} />
                : <WordCount count={words} />
              }
            </div>
          )}
        </div>
      </Fullscreen>
    );
  }
}

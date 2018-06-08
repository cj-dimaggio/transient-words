import React, { Component } from 'react';
import classNames from 'classnames';
import Fullscreen from "react-full-screen";


import Progress from './Progress';
import WordCount from './WordCount';
import WriteButton from './WriteButton';
import Editor from './Editor';

export default class App extends Component {
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
      fade: 2,
      kill: 5,
    };

    this.handleStroke = this.handleStroke.bind(this);

    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleNightMode = this.toggleNightMode.bind(this);
    this.now = this.now.bind(this);
  }

  startWriting() {
    console.log("running")
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
    console.log("going full")
    this.setState((prevState, props) => ({ fullscreen: !prevState.fullscreen }));
  }

  handleStroke(char, words) {
    if (!this.state.run) this.startWriting();
    this.toggleDanger(false);
    this.setState({
      words,
      timeSinceStroke: 0
    });
  }

  stopWriting() {
    clearInterval(this.timerID);
  }

  toggleDanger(on) {
    if (this.state.danger === on) return;
    console.log("Danger", on);
    this.setState({danger: on});
  }

  now() {
    return new Date().getTime() / 1000;
  }

  win() {
    this.setState({
      won: true,
      run: false
    })
  }

  tick() {
    const {
      run,
      words,
      timeSinceStroke,
      startTime,
      fade,
      kill ,
    } = this.state;
    if (!run) return;
    const danger = timeSinceStroke >= fade;
    const duration = this.now() - startTime;
    const progress = (this.props.type === "timed" ? duration : words) / this.props.limit;
    if (progress >= 1) this.win();

    this.setState((prevState, props) => ({
      words,
      progress,
      danger,
      timeSinceStroke: prevState.timeSinceStroke + 0.1
    }));
  }

  render() {
    const appClass = classNames('app', {
      'night-mode': this.state.nightMode
    });
    const {
      fullscreen,
      progress,
      danger,
      won,
      run
    } = this.state;
    return (
      <Fullscreen enabled={fullscreen} >
        <div className={appClass} >
          <Progress progress={progress} won={won} danger={danger} />
          <div className="buttons">
              <i className="icon-night-mode" onClick={this.toggleNightMode}></i>
              <i className="icon-fullscreen" onClick={this.toggleFullscreen}></i>
          </div>
          <div className="content">
            <Editor won={won} onStroke={this.handleStroke} onNightMode={this.toggleNightMode} />
            <WriteButton style="red ghost" />
            <WordCount count={this.state.words} />
          </div>
        </div>
      </Fullscreen>
    );
  }
}

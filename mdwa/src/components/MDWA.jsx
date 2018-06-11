import React, { Component } from 'react';
import Welcome from './Welcome';
import Help from './Help';
import WritingApp from './App';


export default class MDWA extends Component {
  constructor(props) {
    super(props);
    this.toggleHelp = this.toggleHelp.bind(this);
    this.toggleHome = this.toggleHome.bind(this);
    this.toggleWrite = this.toggleWrite.bind(this);
    this.state = {
      screen: 'home'
    }
  }

  toggleHelp() { this.setState({screen: 'help' })}
  toggleHome() { this.setState({screen: 'home' })}
  toggleWrite(type, limit, hardcore) {
    console.log("Ready to write", type, limit, hardcore)
    this.setState({type, limit, hardcore, screen: 'write'});
  }

  render() {
    const { screen } = this.state;
    return (
      <div>
        { screen === "home" && <Welcome onHelp={this.toggleHelp} onWrite={this.toggleWrite} /> }
        { screen === "write" && <WritingApp onHelp={this.toggleHelp} {...this.state} /> }
        { screen === "help" && <Help onWrite={this.toggleWrite} onBack={this.toggleHome} /> }
      </div>
    )
  }
}

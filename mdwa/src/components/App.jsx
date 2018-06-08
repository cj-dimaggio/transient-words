import React, { Component } from 'react';
import Progress from './Progress';
import Editor from './Editor';

export default class App extends Component {

  render() {
    return (
      <div className="App">
        <Progress />
        <div className="content">
          <Editor />
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
var classNames = require('classnames');

export default class Editor extends Component {
  constructor(props) {
      super(props);
      this.state = {
        danger: false,
        progress: .5
      };
    }

  render() {
    return (
      <div className="input-wrap">
        <textarea placeholder="Start typing..." spellCheck="false"></textarea>
      </div>
    )
  }
}

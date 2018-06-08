import React, { Component } from 'react';
var classNames = require('classnames');

export default class Progress extends Component {
  constructor(props) {
      super(props);
      this.state = {
        danger: false,
        progress: .5
      };
    }

  render() {
    var style = { width: this.state.progress * 100 + '%'};
    var classes = classNames('progress', {'danger': this.state.danger });
    return (
      <div className={classes}>
        <div style={style}></div>
      </div>
    )
  }
}

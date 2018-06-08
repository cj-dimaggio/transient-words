import React, { Component } from 'react';
var classNames = require('classnames');

export default class Progress extends React.Component {
  render() {
    var style = { width: this.props.progress * 100 + '%'};
    var classes = classNames('progress', {
      danger: this.props.danger,
      won: this.props.won
    });
    return (
      <div className={classes}>
        <div style={style}></div>
      </div>
    )
  }
}

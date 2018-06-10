import React from 'react';
var classNames = require('classnames');

const Progress = ({progress, danger, won}) => {
    var style = { width: progress * 100 + '%'};
    var classes = classNames('progress', {
      danger: danger,
      won: won
    });
    return (
      <div className={classes}>
        <div style={style}></div>
      </div>
    )
}

export default Progress;

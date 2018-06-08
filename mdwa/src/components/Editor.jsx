import React, { Component } from 'react';
import classNames from 'classnames';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.onStroke = this.onStroke.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.input = React.createRef();
    this.wrapper = React.createRef();
    this.state = {
      cutTop: false,
      cutBottom: false
    }

    this.invalid_chars = [8, 9, 13, 16, 17, 18, 20, 27, 37, 38, 39, 40, 91, 93];
    this.control_keys = [65, 67, 86, 88];
    this.key_replace = {96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111: "/", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 222: "'"};
    this.shift_replace = {",": "<", ".": ">", "/": "?", ";": ":", "'": "\"", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_", "=": "+"};
  }

  onScroll(event) {
    const { scrollTop, scrollHeight } = this.input.current;
    const height = this.wrapper.current.clientHeight;
    this.setState({
      cutTop: scrollTop > 0,
      cutBottom: scrollHeight - 10 > height + scrollTop && scrollHeight > height
    })
  }

  onStroke(event) {
    const key = event.key;
    const charCode = event.keyCode || event.which;
    const ctrl = event.ctrlKey || event.metaKey;
    const alt = event.metaKey || event.altKey;

    if (this.invalid_chars.includes(charCode)) return;
    if (!this.props.won && ctrl && this.control_keys.includes(charCode)) {
      event.preventDefault();
      return;
    }

    const words = event.target.value.split(/\s+/).length;

    if (ctrl && alt && [78, 192].includes(charCode)) {
      this.props.onNightMode();
    } else {
      this.props.onStroke(key, words);
    }
  }

  render() {
    const classes = classNames('editor', {
      'cut-top': this.state.cutTop,
      'cut-bottom': this.state.cutBottom,
    })
    return (
      <div className={classes} ref={this.wrapper}>
        <textarea
          placeholder="Start typing..."
          spellCheck="false"
          onKeyDown={this.onStroke}
          onScroll={this.onScroll}
          ref={this.input}
        ></textarea>
      </div>
    )
  }
}

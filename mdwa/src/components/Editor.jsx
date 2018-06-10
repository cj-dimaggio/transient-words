import React, { Component } from 'react';
import classNames from 'classnames';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onStroke = this.onStroke.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.input = React.createRef();
    this.wrapper = React.createRef();
    this.state = {
      cutTop: false,
      cutBottom: false,
      text: ""
    }

    this.invalid_chars = [
      'Backspace', 'Tab', 'Enter', 'Control', 'Alt', 'Meta', 'Escape',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'CapsLock', 'Shift', 'Delete'
    ];
    this.control_keys = ['a', 'c', 'v', 'x', 'f'];
  }

  onScroll(event) {
    const { scrollTop, scrollHeight } = this.input.current;
    const height = this.wrapper.current.clientHeight;
    this.setState({
      cutTop: scrollTop > 0,
      cutBottom: scrollHeight - 10 > height + scrollTop && scrollHeight > height
    });
  }

  onChange(event) {
    this.setState({text: event.target.value});
  }

  onStroke(event) {
    const key = event.key;
    const ctrl = event.ctrlKey || event.metaKey;
    const alt = event.metaKey || event.altKey;

    if (this.invalid_chars.includes(key) || event.repeat) return;
    if (!this.props.won && ctrl && this.control_keys.includes(key)) {
      event.preventDefault();
      return;
    }

    if (ctrl && alt && key === 'n') {
      this.props.onNightMode();
    } else {
      this.props.onStroke(key, this.state.text);
    }
  }

  reset() {
    this.setState({ cutTop: false, cutBottom: false, text: ""});
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
          onChange={this.onChange}
          onScroll={this.onScroll}
          ref={this.input}
          value={this.state.text}
        ></textarea>
      </div>
    )
  }
}

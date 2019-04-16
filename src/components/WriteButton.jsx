import React from 'react';
import { Link } from "react-router-dom";
var classNames = require('classnames');

export default class WriteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hardcore: false,
      limit: this.props.limit || 5,
      type: this.props.type || "minutes",
      compact: true,
      hidePanel: this.props.hidePanel
    };

    this.onExpand = this.onExpand.bind(this);
    this.setLimit = this.setLimit.bind(this);
    this.setType = this.setType.bind(this);
    this.toggleHardcore = this.toggleHardcore.bind(this);
    this.showPanel = this.showPanel.bind(this);
  }

  onExpand() {
    this.setState({compact: false});
  }

  renderCompactChooser() {
    const {limit, type} = this.state;
    return (
      <div className="session-chooser">
        <div className="compact"  onClick={ this.onExpand }>
          Session length:
          <span className="choice">{limit} {type} <i className="edit icon-pencil"></i></span>

        </div>
      </div>
    )
  }

  showPanel() { this.setState({hidePanel: false}); }
  setLimit(limit) { this.setState({limit}); }
  setType(type) {
    this.setState({
      type: type,
      limit: this.props.limits[type][1]
    });
  }
  toggleHardcore(hardcore) { this.setState((prevState, props) => ({ hardcore: !prevState.hardcore })); }

  renderOptions() {
    const options = this.props.limits[this.state.type];
    return options.map((limit) => {
      const classes = classNames('radio', {active: limit === this.state.limit});
      return <span key={limit} className={classes} onClick={() => this.setLimit(limit)}>{limit}</span>
    }
    );
  }

  renderFullChooser() {
    const classes = classNames('full', this.state.type)
    return (
      <div className="session-chooser">
        <div className={classes}>
          <div className="tabs">
              <span className="minutes" onClick={() => this.setType("minutes")}>Minutes</span>
              &nbsp;/&nbsp;
              <span className="words" onClick={() => this.setType("words")}>Words</span>
          </div>
          <div className="radios">
            { this.renderOptions() }
          </div>
            <div onClick={this.toggleHardcore} className={classNames('hardcore', {checked: this.state.hardcore})}>Hardcore mode</div>
        </div>
      </div>
    )
  }

  render() {
    const wrapperWlasses = classNames("writeButton", {small: this.props.small})
    const buttonClasses = classNames(this.props.color, {
      small: this.props.small,
      ghost: this.props.ghost
    })
    const {limit, type, hardcore} = this.state;
    return (
      <div className={wrapperWlasses}>
        { !this.props.noPanel && !this.state.hidePanel && (this.state.compact ? this.renderCompactChooser() : this.renderFullChooser()) }
        <Link
          to={{
            pathname: "/write",
            search: `?limit=${limit}&type=${type}` + (hardcore ? '&hardcore=true' : '')
          }}
          className={buttonClasses}
          onMouseOver={this.showPanel}
        >
          { this.props.label }
        </Link>
      </div>
    )
  }
}

WriteButton.defaultProps = {
  label: "Start Writing",
  small: false,
  hidePanel: false,
  limits: {
    minutes: [3, 5, 10, 15, 20, 30, 60],
    words: [75, 150, 250, 500, 1667]
  }
}

import React from 'react';
var classNames = require('classnames');

export default class WriteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hardcore: false,
      limit: this.props.limit || 5,
      type: this.props.type || "timed",
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
    const limit = this.state.limit;
    const unit = this.state.type === "timed" ? "minutes" : "words";
    return (
      <div className="session-chooser">
        <div className="compact"  onClick={ this.onExpand }>
          Session length:
          <span className="choice">{limit} {unit} <i className="edit icon-pencil"></i></span>

        </div>
      </div>
    )
  }

  showPanel() { this.setState({hidePanel: false}); }
  setLimit(limit) { this.setState({limit}); }
  setType(type) { this.setState({type}); }
  toggleHardcore(hardcore) { this.setState((prevState, props) => ({ hardcore: !prevState.hardcore })); }

  renderOptions() {
    const options = this.state.type === "timed" ? this.props.time_limits : this.props.word_limits;
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
              <span className="timed" onClick={() => this.setType("timed")}>Minutes</span>
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
        <button
          className={buttonClasses}
          onMouseOver={this.showPanel}
          onClick={() => {this.props.onSubmit(type, limit, hardcore); }}
        >
          { this.props.label }
        </button>
      </div>
    )
  }
}

WriteButton.defaultProps = {
  label: "Start Writing",
  small: false,
  hidePanel: false,
  time_limits: [3, 5, 10, 20, 30, 60],
  word_limits: [75, 150, 250, 500, 1667]
}

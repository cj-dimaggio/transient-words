import React, { Component } from 'react';
import WritingApp from './App';


export default class MDWA extends Component {
  constructor(props) {
    super(props);
    this.run = this.run.bind(this);
    this.state = {
      limit: 5,
      type: "words",
      hardcore: false
    }
  }

  run(type, limit, hardcore) {
    console.log("in run")
    this.setState({type, limit, hardcore})
  }


  render() {
    const {limit, type} = this.state;
    return (
      <div>
        <WritingApp limit={limit} type={type} onReset={this.run} />
      </div>
    )
  }
}

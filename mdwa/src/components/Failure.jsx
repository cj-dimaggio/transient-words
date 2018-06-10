import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import WriteButton from './WriteButton';

const TweetButton = ({words}) => {
  const href = `https://twitter.com/intent/tweet?text=I+wrote+${words}+words+using+The+Most+Dangerous+Writing+App+-+until+it+deleted+everything+.+%23MDWA&url=http%3A%2F%2Fwww.themostdangerouswritingapp.com`;
  const label = `I wrote ${words} words using The Most Dangerous Writing App - until it deleted everything.`;
  return <a className="tweet" href={href}>{label}</a>;
}

const Failure = ({active, words, limit, type, onReset}) => {
  return (
    <CSSTransitionGroup
      transitionName="failure"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={100}
    >
    { active && (
      <div className='failure' key="failScreen">
        <div className="inner">
          <h3>You failed.</h3>
          <TweetButton words={words} />
          <WriteButton
            ghost
            noPanel
            color="white"
            label="Try
            Again."
            type={type}
            limit={limit}
            onSubmit={onReset}
          />
        </div>
      </div>
      )}
    </CSSTransitionGroup>
  )
}

export default Failure;

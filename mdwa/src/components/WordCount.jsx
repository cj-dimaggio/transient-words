import React from 'react';

const WordCount = ({count}) => {
  return <div className="wordcount">{ count || 0 } { count === 1 ? "word" : "words" }</div>
}
export default WordCount;

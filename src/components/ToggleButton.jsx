import React from 'react';

export default ({ value, setValue, label }) => (
  <button
    className="tiny ghost"
    onClick={() =>setValue(!value)} >
      {label}: {value ? 'On' : 'Off'}
  </button>
)
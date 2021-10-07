import React from 'react';
import classNames from 'classnames';

const disabled_keys = ['Tab'];
const hidden_keys = [
  'Backspace', 'Tab', 'Enter', 'Control', 'Alt', 'Meta', 'Escape',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'CapsLock', 'Shift', 'Delete', 'Home', 'End'
];

const bufferTime = 1000;
const transitionTime = 5100;

export default ({ onTimeUp }) => {
  const editorRef = React.useRef();
  const inputRef = React.useRef();

  const [fadeOut, setFadeOut] = React.useState(false);

  const [scrollState, setScrollState] = React.useState({ cutTop: false, cutBottom: false });
  const onScroll = (event) => {
    const { scrollTop, scrollHeight } = inputRef.current;
    const height = editorRef.current.clientHeight;
    setScrollState({
      cutTop: scrollTop > 0,
      cutBottom: scrollHeight - 10 > height + scrollTop && scrollHeight > height
    });
  }

  const [countDown, setCountDown] = React.useState(null);

  const onKeyDown = (event) => {
    const key = event.key;

    if (disabled_keys.includes(key)) {
      event.preventDefault();
      return;
    };

    if (hidden_keys.includes(key) || event.repeat || event.ctrlKey || event.metaKey) return;

    clearTimeout(countDown);
    setFadeOut(false);

    setCountDown(setTimeout(() => {
      setFadeOut(true);
      setCountDown(setTimeout(() => {
        if (inputRef.current.value) {
          onTimeUp(inputRef.current.value);
        }

        inputRef.current.value = '';
        setFadeOut(false);
      }, transitionTime));
    }, bufferTime));
  }
  
  return (
    <div
    className={classNames('editor', {
      'cut-top': scrollState.cutTop,
      'cut-bottom': scrollState.cutBottom,
      'fade-out': fadeOut
    })}
    ref={editorRef}
    >
      <textarea
        placeholder="Start typing..."
        spellCheck={false}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        ref={inputRef}
      ></textarea>
    </div>
  )
}

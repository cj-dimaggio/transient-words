import React from 'react';
import FileSaver from 'file-saver';

export default ({ entries, setEntries }) => {
  const download = () => {
    if (!entries.length) {
      return;
    }

    const date = new Date().toLocaleDateString();

    const rawText = entries.join('\n\n~~~\n\n');
    // Replace clean newlines with windows evil
    const text = rawText.replace(/([^\r])\n/g, "$1\r\n");
    const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    const filename = `ephemeral-${date}).txt`;
    FileSaver.saveAs(blob, filename);
  }

  return (
    <button onClick={download} className="tiny ghost">Download Previous Entries</button>
  )
}

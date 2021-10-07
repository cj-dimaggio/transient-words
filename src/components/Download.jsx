import React from 'react';
import FileSaver from 'file-saver';

export default ({ entries, text }) => {
  const download = () => {
    if (!text && !entries.length) {
      return;
    }

    const date = new Date().toLocaleDateString();

    const raw = [...entries, text].join('\n\n~~~\n\n');
    // Replace clean newlines with windows evil
    const final = raw.replace(/([^\r])\n/g, "$1\r\n");
    const blob = new Blob([final], {type: "text/plain;charset=utf-8"});
    const filename = `ephemeral-${date}.txt`;
    FileSaver.saveAs(blob, filename);
  }

  return (
    <button onClick={download} className="tiny ghost">Download All Entries</button>
  )
}

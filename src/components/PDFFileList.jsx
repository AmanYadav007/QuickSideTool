import React from 'react';

const PDFFileList = ({ files }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
      <ul className="list-disc pl-5">
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PDFFileList;
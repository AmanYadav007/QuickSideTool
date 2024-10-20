import React from 'react';

const PDFOperationCard = ({ name, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm font-medium">{name}</div>
    </button>
  );
};

export default PDFOperationCard;
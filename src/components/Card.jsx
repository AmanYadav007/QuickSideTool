import React from 'react';

const Card = ({ id, image, flipped, solved, onClick }) => {
  return (
    <div
      className={`card ${flipped ? 'flipped' : ''} ${solved ? 'solved' : ''}`}
      onClick={() => onClick(id)}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-content">?</div>
        </div>
        <div className="card-back">
          <div className="card-content">{image}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;


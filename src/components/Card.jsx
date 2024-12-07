import React from 'react';

const Card = ({ id, image, flipped, solved, onClick }) => {
  return (
    <div
      className={`card ${flipped ? 'flipped' : ''} ${solved ? 'solved' : ''}`}
      onClick={() => onClick(id)}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{image}</div>
      </div>
    </div>
  );
};

export default Card;


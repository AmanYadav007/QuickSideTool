import React, { useState, useEffect } from 'react';
import Card from './Card';

const cardImages = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'
];

const Game = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({ id: index, image }));
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
  };

  const handleClick = (id) => {
    if (disabled) return;
    if (flipped.length === 0) {
      setFlipped([id]);
    } else if (flipped.length === 1) {
      setDisabled(true);
      if (flipped[0] !== id) {
        setFlipped([flipped[0], id]);
        if (cards[flipped[0]].image === cards[id].image) {
          setSolved([...solved, flipped[0], id]);
          setFlipped([]);
          setDisabled(false);
        } else {
          setTimeout(() => {
            setFlipped([]);
            setDisabled(false);
          }, 1000);
        }
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  return (
    <div className="game">
      <h1>Memory Card Game</h1>
      <button onClick={initializeGame} className="button">
        New Game
      </button>
      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            image={card.image}
            flipped={flipped.includes(card.id)}
            solved={solved.includes(card.id)}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Game;


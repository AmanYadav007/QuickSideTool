import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import Card from './Card';
import './Game.css';

const cardImages = [
  '🌟', '🌙', '🌎', '🌈', '🌞', '🌺', '🍄', '🦋'
];

const Game = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setMoves(0);
    setGameWon(false);
  };

  const handleClick = (id) => {
    if (disabled) return;
    if (flipped.length === 0) {
      setFlipped([id]);
      setMoves(moves + 1);
    } else if (flipped.length === 1) {
      setDisabled(true);
      if (flipped[0] !== id) {
        setFlipped([flipped[0], id]);
        setMoves(moves + 1);
        if (cards[flipped[0]].image === cards[id].image) {
          setSolved([...solved, flipped[0], id]);
          setFlipped([]);
          setDisabled(false);
          if (solved.length + 2 === cards.length) {
            setGameWon(true);
          }
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
    <div className="game-container">
      {gameWon && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      <div className="game-header">
        <h1 className="game-title">Cosmic Memory</h1>
        <div className="game-info">
          <span className="moves">Moves: {moves}</span>
          <button onClick={initializeGame} className="new-game-btn">
            New Game
          </button>
          <button
            className="back-home-btn"
            onClick={() => window.history.back()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
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
      {gameWon && (
        <div className="win-message">
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You've completed the game in {moves} moves</p>
          <button onClick={initializeGame} className="play-again-btn">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;


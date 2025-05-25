import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, RotateCw, Trophy, Clock, X, Loader2 } from 'lucide-react';
import Confetti from 'react-confetti';

const HOLE_COUNT = 9;
const MOLE_UP_DURATION = 900; // How long a mole stays up (ms)
const GAME_DURATION = 30; // Game duration in seconds
const INITIAL_MOLE_INTERVAL = 1200; // Time *BEFORE* a mole pops up (ms)
const MIN_MOLE_INTERVAL = 400; // Fastest interval
const INTERVAL_DECREMENT = 60; // How much to decrease interval each round

const WhacAMoleGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameActive, setGameActive] = useState(false);
  const [activeMole, setActiveMole] = useState(null); // Index of the currently active mole hole
  const [moleHit, setMoleHit] = useState(null); // Index of the mole that was just hit (for hit animation)
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Refs for managing timers and mutable game state values
  const gameTimerId = useRef(null); 
  const molePopTimerId = useRef(null); // Timer for when the *next* mole is scheduled to appear
  const moleDownTimerId = useRef(null); // Timer for when the *current* active mole should go down
  const currentMoleInterval = useRef(INITIAL_MOLE_INTERVAL); // Controls the speed of mole appearance

  // --- Core Game Logic Functions ---

  // Clears all active timers
  const clearAllGameTimers = useCallback(() => {
    clearInterval(gameTimerId.current);
    clearTimeout(molePopTimerId.current);
    clearTimeout(moleDownTimerId.current);
    gameTimerId.current = null;
    molePopTimerId.current = null;
    moleDownTimerId.current = null;
  }, []);

  // Function to manage the mole popping sequence
  const popNextMole = useCallback(() => {
    if (!gameActive || timeLeft <= 0) { // Game is over or not active, stop popping
      setActiveMole(null);
      clearAllGameTimers();
      return;
    }

    setActiveMole(null); // Hide previous mole (if any)
    setMoleHit(null); // Clear hit state for new mole
    clearTimeout(moleDownTimerId.current); // Ensure any previous 'mole down' timer is cleared

    // Randomly choose a hole that isn't the currently active one
    let newMoleIndex;
    const prevActiveMole = activeMole;
    do {
      newMoleIndex = Math.floor(Math.random() * HOLE_COUNT);
    } while (newMoleIndex === prevActiveMole);

    setActiveMole(newMoleIndex); // Make the new mole active
    setMessage('Whac it!');

    // Schedule mole to go down after MOLE_UP_DURATION
    moleDownTimerId.current = setTimeout(() => {
        setActiveMole(null); // Mole goes down
        currentMoleInterval.current = Math.max(MIN_MOLE_INTERVAL, currentMoleInterval.current - INTERVAL_DECREMENT);
        
        // Schedule the *next* mole to pop up after the calculated interval
        molePopTimerId.current = setTimeout(popNextMole, currentMoleInterval.current);
    }, MOLE_UP_DURATION);
    
  }, [gameActive, timeLeft, activeMole, clearAllGameTimers]);

  // Handle a mole click
  const handleMoleClick = useCallback((index) => {
    if (!gameActive || activeMole !== index || moleHit === index) {
      return; // Ignore invalid clicks
    }
    
    setScore(prevScore => prevScore + 1);
    setMoleHit(index); // Mark this mole as hit for animation
    setMessage('Nice one!');

    // Mole goes down instantly when hit
    clearTimeout(moleDownTimerId.current); // Stop current mole's scheduled disappearance
    setActiveMole(null); // Hide it immediately

    // Schedule the *next* mole to pop up quickly after a hit
    clearTimeout(molePopTimerId.current); // Clear any pending 'next pop' timer
    molePopTimerId.current = setTimeout(popNextMole, 250); // Short delay for next mole
    
  }, [gameActive, activeMole, moleHit, popNextMole]);

  // Reset game state
  const resetGame = useCallback(() => {
    clearAllGameTimers();
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameActive(false);
    setActiveMole(null);
    setMoleHit(null);
    setMessage('');
    setShowConfetti(false);
    currentMoleInterval.current = INITIAL_MOLE_INTERVAL;
  }, [clearAllGameTimers]);

  // Start game handler
  const startGame = useCallback(() => {
    resetGame(); // Ensure clean slate
    setGameActive(true);
    setMessage('Get ready!');

    // Game countdown timer
    gameTimerId.current = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(gameTimerId.current);
          clearAllGameTimers(); // Ensure moles stop when game ends
          setGameActive(false);
          setActiveMole(null);
          setMessage(`Game Over! Your score: ${score}`);
          if (score > 0) {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 5000);
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);

    // CRUCIAL: Start the very first mole pop after a short delay
    // This allows `gameActive` to be true in the next render cycle when `popNextMole` is called.
    // The `molePopTimerId.current` is set here to ensure it's managed from the start.
    molePopTimerId.current = setTimeout(popNextMole, INITIAL_MOLE_INTERVAL); 

  }, [resetGame, popNextMole, score, clearAllGameTimers]);


  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      clearAllGameTimers();
    };
  }, [clearAllGameTimers]);

  // Ensure mole appears after gameActive becomes true (less critical with new startGame, but adds robustness)
  useEffect(() => {
    if (gameActive && timeLeft > 0 && activeMole === null && molePopTimerId.current === null && moleDownTimerId.current === null) {
      // This block helps in scenarios where a timer might unexpectedly not be set,
      // and the game is active but no mole is up.
      // Removed the direct call to popNextMole to avoid double scheduling.
      // The main scheduling is now handled within popNextMole itself.
    }
  }, [gameActive, timeLeft, activeMole]); // These deps are fine as they trigger a check

  // Initial render guard (from previous fix, safe to keep)
  const [hasRendered, setHasRendered] = useState(false);
  useEffect(() => {
      setHasRendered(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans antialiased">
      {showConfetti && <Confetti tweenDuration={1000} recycle={false} numberOfPieces={500} />}

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-yellow-500/20 blur-3xl animate-blob-fade top-1/4 left-[15%] animation-delay-0"></div>
        <div className="absolute w-80 h-80 rounded-full bg-orange-500/20 blur-3xl animate-blob-fade top-[65%] left-[70%] animation-delay-2000"></div>
        <div className="absolute w-72 h-72 rounded-full bg-red-500/20 blur-3xl animate-blob-fade top-[10%] left-[60%] animation-delay-4000"></div>
        <div className="absolute w-56 h-56 rounded-full bg-pink-500/20 blur-3xl animate-blob-fade top-[80%] left-[20%] animation-delay-6000"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header/Back Button */}
        <header className="py-4 px-4 md:px-8 border-b border-white border-opacity-10 backdrop-blur-lg shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-1.5 bg-white/10 text-white rounded-full
                         hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20
                         hover:border-blue-400 transform hover:scale-105 shadow-md animate-fade-in-left text-sm"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 drop-shadow-md animate-fade-in-down flex-grow px-4">
              Whac-A-Mole!
            </h1>
            <div className="w-[110px] md:w-[130px] flex-shrink-0"></div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl animate-fade-in-up text-center">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Can you whac 'em all?</h2>
              <p className="text-lg text-gray-300">{message || 'Click "Start Game" to begin!'}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 bg-gray-800/50 p-4 rounded-lg shadow-inner">
              {hasRendered && Array.from({ length: HOLE_COUNT }).map((_, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-square bg-gray-700 rounded-lg overflow-hidden border-b-4 border-gray-900 shadow-md transform transition-transform duration-100 ease-out active:scale-95 cursor-pointer"
                  onClick={() => handleMoleClick(index)}
                >
                  {/* Mole hole background */}
                  <div className="absolute inset-0 bg-gray-600 rounded-lg"></div>

                  {/* Mole Character */}
                  <div
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full w-4/5 h-4/5 bg-gradient-to-br from-yellow-300 to-orange-400 border-2 border-yellow-500 transition-all duration-200 ease-out flex items-center justify-center
                      ${activeMole === index ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
                      ${moleHit === index ? 'animate-whac' : ''}
                    `}
                    style={{
                      boxShadow: activeMole === index ? '0 -5px 15px rgba(255, 255, 0, 0.4)' : 'none',
                    }}
                  >
                    <span role="img" aria-label="mole" className="text-4xl leading-none">
                      ⚡
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-around items-center mb-8 bg-gray-800/50 p-4 rounded-lg shadow-inner">
              <div className="flex items-center text-xl font-bold text-white">
                <Trophy size={24} className="mr-2 text-yellow-400" /> Score: {score}
              </div>
              <div className="flex items-center text-xl font-bold text-white">
                <Clock size={24} className="mr-2 text-orange-400" /> Time: {timeLeft}s
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {!gameActive ? (
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  <Play size={24} className="mr-2" /> Start Game
                </button>
              ) : (
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  <RotateCw size={24} className="mr-2" /> Reset Game
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WhacAMoleGame;
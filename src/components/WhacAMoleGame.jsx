import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, RotateCw, Trophy, Clock, X } from "lucide-react";
import Confetti from "react-confetti";

// --- Game Constants ---
const HOLE_COUNT = 9;
const GAME_DURATION = 30; // Game duration in seconds

// --- Difficulty Settings ---
// Define different difficulty levels and their associated game parameters
const DIFFICULTY_SETTINGS = {
  easy: {
    label: "Easy",
    moleUpDuration: 1100, // Moles stay up longer
    initialMoleInterval: 1500, // Slower initial pace
    minMoleInterval: 600, // Slowest speed a mole can pop up
    intervalDecrement: 50, // Slowest speed increase
  },
  medium: {
    label: "Medium",
    moleUpDuration: 900, // Standard
    initialMoleInterval: 1200, // Standard
    minMoleInterval: 400, // Standard
    intervalDecrement: 60, // Standard
  },
  hard: {
    label: "Hard",
    moleUpDuration: 700, // Moles stay up for less time
    initialMoleInterval: 900, // Faster initial pace
    minMoleInterval: 200, // Fastest speed a mole can pop up
    intervalDecrement: 80, // Fastest speed increase
  },
};

const WhacAMoleGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameActive, setGameActive] = useState(false);
  const [activeMole, setActiveMole] = useState(null);
  const [moleHit, setMoleHit] = useState(null);
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [difficulty, setDifficulty] = useState("medium"); // Default difficulty

  // Refs for managing timers and mutable game state values
  const gameTimerId = useRef(null);
  const molePopTimerId = useRef(null);
  const moleDownTimerId = useRef(null);
  // currentMoleInterval will now be dynamically set based on difficulty
  const currentMoleInterval = useRef(
    DIFFICULTY_SETTINGS.medium.initialMoleInterval
  );

  // Audio Refs
  const whacSoundRef = useRef(null);
  const missSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);

  // Initialize audio elements once when the component mounts
  useEffect(() => {
    // Ensure audio files are in your public folder or adjust paths accordingly
    whacSoundRef.current = new Audio("/whac_sound.mp3");
    missSoundRef.current = new Audio("/miss_sound.mp3");
    gameOverSoundRef.current = new Audio("/game_over_sound.mp3");

    // Preload sounds for faster playback and try to handle autoplay policy
    const loadSounds = async () => {
      try {
        await Promise.all([
          whacSoundRef.current.load(),
          missSoundRef.current.load(),
          gameOverSoundRef.current.load(),
        ]);
      } catch (e) {
        console.warn(
          "Audio loading failed, sounds might not play without user interaction.",
          e
        );
        // You might want to show a message to the user here
      }
    };
    loadSounds();
  }, []);

  // Get current difficulty settings (memoized for efficiency)
  const currentDifficulty = DIFFICULTY_SETTINGS[difficulty];

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
    if (!gameActive || timeLeft <= 0) {
      setActiveMole(null);
      clearAllGameTimers();
      return;
    }

    setActiveMole(null);
    setMoleHit(null);
    clearTimeout(moleDownTimerId.current);

    let newMoleIndex;
    const prevActiveMole = activeMole;
    do {
      newMoleIndex = Math.floor(Math.random() * HOLE_COUNT);
    } while (newMoleIndex === prevActiveMole);

    setActiveMole(newMoleIndex);
    setMessage("Whac it!");

    moleDownTimerId.current = setTimeout(() => {
      setActiveMole(null); // Mole goes down
      // Decrease interval based on current difficulty setting
      currentMoleInterval.current = Math.max(
        currentDifficulty.minMoleInterval,
        currentMoleInterval.current - currentDifficulty.intervalDecrement
      );

      // Schedule the *next* mole to pop up after the calculated interval
      molePopTimerId.current = setTimeout(
        popNextMole,
        currentMoleInterval.current
      );
    }, currentDifficulty.moleUpDuration); // Mole stays up for duration based on difficulty
  }, [gameActive, timeLeft, activeMole, clearAllGameTimers, currentDifficulty]);

  // Handle a mole click
  const handleMoleClick = useCallback(
    (index) => {
      if (!gameActive || activeMole !== index || moleHit === index) {
        // Play miss sound if clicking an empty or already hit hole
        if (gameActive && missSoundRef.current) {
          missSoundRef.current.currentTime = 0; // Reset playback position
          missSoundRef.current
            .play()
            .catch((e) => console.error("Error playing miss sound:", e));
        }
        return; // Ignore invalid clicks
      }

      setScore((prevScore) => prevScore + 1);
      setMoleHit(index); // Mark this mole as hit for animation
      setMessage("Nice one!");

      // Play whac sound
      if (whacSoundRef.current) {
        whacSoundRef.current.currentTime = 0; // Reset playback position
        whacSoundRef.current
          .play()
          .catch((e) => console.error("Error playing whac sound:", e));
      }

      // Mole goes down instantly when hit
      clearTimeout(moleDownTimerId.current); // Stop current mole's scheduled disappearance
      setActiveMole(null); // Hide it immediately

      // Schedule the *next* mole to pop up quickly after a hit
      clearTimeout(molePopTimerId.current); // Clear any pending 'next pop' timer
      molePopTimerId.current = setTimeout(popNextMole, 250); // Short delay for next mole
    },
    [gameActive, activeMole, moleHit, popNextMole]
  );

  // Reset game state
  const resetGame = useCallback(() => {
    clearAllGameTimers();
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameActive(false);
    setActiveMole(null);
    setMoleHit(null);
    setMessage("");
    setShowConfetti(false);
    // Reset interval to initial based on current difficulty
    currentMoleInterval.current = currentDifficulty.initialMoleInterval;
  }, [clearAllGameTimers, currentDifficulty]);

  // Start game handler
  const startGame = useCallback(() => {
    resetGame(); // Ensure clean slate
    setGameActive(true);
    setMessage("Get ready!");

    // Game countdown timer
    gameTimerId.current = setInterval(() => {
      setTimeLeft((prevTime) => {
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
          // Play game over sound
          if (gameOverSoundRef.current) {
            gameOverSoundRef.current.currentTime = 0;
            gameOverSoundRef.current
              .play()
              .catch((e) => console.error("Error playing game over sound:", e));
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, [resetGame, score, clearAllGameTimers]); // score is a dependency because it's used in the message

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      clearAllGameTimers();
    };
  }, [clearAllGameTimers]);

  // This useEffect will start the first mole pop when gameActive becomes true
  useEffect(() => {
    if (gameActive && molePopTimerId.current === null && timeLeft > 0) {
      molePopTimerId.current = setTimeout(
        popNextMole,
        currentDifficulty.initialMoleInterval
      );
    }
    return () => {
      if (!gameActive) {
        clearTimeout(molePopTimerId.current);
        molePopTimerId.current = null;
      }
    };
  }, [gameActive, timeLeft, popNextMole, currentDifficulty]);

  // This effect sets `currentMoleInterval` when difficulty changes,
  // but only when the game is NOT active, to avoid disrupting a running game.
  useEffect(() => {
    if (!gameActive) {
      currentMoleInterval.current = currentDifficulty.initialMoleInterval;
      // Optionally update message if difficulty changes while not active
      setMessage(
        `Difficulty: ${currentDifficulty.label}. Click "Start Game" to begin!`
      );
    }
  }, [difficulty, gameActive, currentDifficulty]);

  // Initial render guard
  const [hasRendered, setHasRendered] = useState(false);
  useEffect(() => {
    setHasRendered(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans antialiased">
      {showConfetti && (
        <Confetti tweenDuration={1000} recycle={false} numberOfPieces={500} />
      )}

      {/* Background Animated Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-yellow-500/20 blur-3xl animate-blob-fade top-1/4 left-[15%] animation-delay-0"></div>
        <div className="absolute w-80 h-80 rounded-full bg-orange-500/20 blur-3xl animate-blob-fade top-[65%] left-[70%] animation-delay-2000"></div>
        <div className="absolute w-72 h-72 rounded-full bg-red-500/20 blur-3xl animate-blob-fade top-[10%] left-[60%] animation-delay-4000"></div>
        <div className="absolute w-56 h-56 rounded-full bg-pink-500/20 blur-3xl animate-blob-fade top-[80%] left-[20%] animation-delay-6000"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="py-4 px-4 md:px-8 border-b border-white/10 backdrop-blur-lg shadow-lg relative">
          <div className="container mx-auto flex items-center justify-between">
            {/* Left aligned: Back to Home */}
            <Link
              to="/"
              className="inline-flex items-center px-4 py-1.5 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-blue-400 transform hover:scale-105 shadow-md text-sm"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Home
            </Link>

            {/* Title - Absolutely positioned for perfect centering */}
            <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 drop-shadow-md px-4">
              Whac-A-Mole!
            </h1>

            {/* Difficulty Selector or Game Control Button */}
            {gameActive ? (
              <button
                onClick={resetGame}
                className="inline-flex items-center px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md text-sm transition-all duration-300 transform hover:scale-105"
              >
                <X className="mr-2 w-4 h-4" />
                Stop Game
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                {" "}
                {/* Container for Difficulty + Start */}
                <button
                  onClick={startGame}
                  className="inline-flex items-center px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md text-sm transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="mr-2 w-4 h-4" />
                  Start Game
                </button>
              </div>
            )}
          </div>
        </header>

        <select
          className="bg-white/10 border border-white/20 text-white text-sm px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none pr-8 cursor-pointer" // Added appearance-none and pr-8 for custom arrow
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          disabled={gameActive} // Disable select while game is active
        >
          {Object.entries(DIFFICULTY_SETTINGS).map(([key, settings]) => (
            <option key={key} value={key} className="bg-gray-800 text-white">
              {settings.label}
            </option>
          ))}
        </select>

        {/* Main Game UI */}
        <main className="flex flex-col items-center justify-center flex-grow px-4 py-8 md:py-12">
          {/* Game Info - Score and Time */}
          <div className="flex justify-center items-center space-x-6 sm:space-x-8 text-xl font-bold mb-8 bg-gray-800/50 p-4 rounded-lg shadow-inner w-full max-w-sm">
            <div className="flex items-center text-white">
              <Trophy size={24} className="mr-2 text-yellow-400" /> Score:{" "}
              <span className="ml-2 text-yellow-300">{score}</span>
            </div>
            <div className="flex items-center text-white">
              <Clock size={24} className="mr-2 text-orange-400" /> Time:{" "}
              <span className="ml-2 text-orange-300">{timeLeft}s</span>
            </div>
          </div>

          <p className="mb-6 text-white text-xl italic font-semibold text-center h-8 flex items-center justify-center">
            {message}
          </p>

          {/* Mole Holes Grid */}
          <div className="grid grid-cols-3 gap-5 sm:gap-6 bg-gray-900/40 p-5 sm:p-7 rounded-2xl shadow-xl border border-gray-700 max-w-md w-full">
            {hasRendered &&
              Array.from({ length: HOLE_COUNT }).map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleMoleClick(index)}
                  // Dynamic styling for mole holes
                  className={`relative overflow-hidden w-full pb-[100%] rounded-full cursor-pointer transition-all duration-200 ease-out transform
                  ${
                    activeMole === index
                      ? moleHit === index
                        ? "scale-95" // Mole hit, slightly shrink
                        : "scale-105" // Mole up, slightly larger
                      : "scale-100" // Default size
                  }
                  flex items-center justify-center
                  bg-gray-800 border-4 border-gray-700 shadow-inner-xl
                `}
                >
                  {/* Visual hole opening (darker inner circle) */}
                  <div className="absolute inset-0 rounded-full bg-gray-900 border border-gray-700 transform scale-[0.9] shadow-inner-2xl"></div>

                  {/* Mole Character */}
                  <div
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full w-4/5 h-4/5 bg-gradient-to-br from-yellow-300 to-orange-400 border-2 border-yellow-500 transition-all duration-200 ease-out flex items-center justify-center
                    ${
                      activeMole === index
                        ? "translate-y-0 opacity-100 animate-pop-up"
                        : "translate-y-full opacity-0"
                    }
                    ${moleHit === index ? "animate-whac" : ""}
                  `}
                    style={{
                      boxShadow:
                        activeMole === index
                          ? "0 -5px 15px rgba(255, 255, 0, 0.4)"
                          : "none",
                    }}
                  >
                    <span
                      role="img"
                      aria-label="mole"
                      className="text-4xl leading-none"
                    >
                      ⚡
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
};
export default WhacAMoleGame;
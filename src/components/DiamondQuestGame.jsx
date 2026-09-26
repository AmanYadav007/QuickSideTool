import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const GRID_SIZE = 5;
const DIAMOND = "diamond";
const BOMB = "bomb";
const DIAMOND_EMOJI = "💎";
const CELEBRATE_EMOJIS = ["💎", "🎉", "✨", "💎", "🎉", "✨"];
const BOMB_EMOJI = "💣";
const DIAMOND_COLOR = "#00DF81"; // Caribbean Green
const BOMB_COLOR = "#ef4444";
const BG_COLOR = "#021B1A"; // Rich Black
const BUTTON_COLOR = "#00DF81";
const FONT_FAMILY = "var(--font-sans)";
const BOMB_OPTIONS = [3, 5, 10];

function generateGrid(bombCount) {
  const totalCells = GRID_SIZE * GRID_SIZE;
  const bombPositions = new Set();
  while (bombPositions.size < bombCount) {
    bombPositions.add(Math.floor(Math.random() * totalCells));
  }
  const grid = [];
  for (let i = 0; i < totalCells; i++) {
    grid.push({
      type: bombPositions.has(i) ? BOMB : DIAMOND,
      revealed: false,
      animating: false,
      justRevealed: false,
    });
  }
  return grid;
}

const getHighScore = () => Number(localStorage.getItem("diamondquest_highscore") || 0);
const setHighScore = (score) => localStorage.setItem("diamondquest_highscore", score);

const DiamondQuestGame = () => {
  const [bombCount, setBombCount] = useState(5);
  const [grid, setGrid] = useState(() => generateGrid(5));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScoreState] = useState(getHighScore());
  const [diamondsFound, setDiamondsFound] = useState(0);
  const [, setMessage] = useState("Find the diamonds, avoid the bombs!");
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [newHighScore, setNewHighScore] = useState(false);
  const celebrateTimeout = useRef(null);

  useEffect(() => {
    setGrid(generateGrid(bombCount));
    setGameOver(false);
    setScore(0);
    setDiamondsFound(0);
    setMessage("Find the diamonds, avoid the bombs!");
    setShowCelebrate(false);
    setNewHighScore(false);
    if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
  }, [bombCount]);

  const handleCellClick = (idx) => {
    if (gameOver || grid[idx].revealed) return;
    const newGrid = grid.slice();
    newGrid[idx].revealed = true;
    newGrid[idx].animating = true;
    newGrid[idx].justRevealed = true;
    setGrid(newGrid);
    setTimeout(() => {
      newGrid[idx].animating = false;
      setGrid([...newGrid]);
    }, 400);
    if (newGrid[idx].type === BOMB) {
      setGameOver(true);
      setMessage("💥 Game Over! You hit a bomb.");
      if (score > highScore) {
        setHighScore(score);
        setHighScoreState(score);
        setShowCelebrate(true);
        setNewHighScore(true);
        celebrateTimeout.current = setTimeout(() => setShowCelebrate(false), 1800);
      }
    } else {
      setDiamondsFound(diamondsFound + 1);
      setScore(score + 10);
      setMessage("+10 Stardust!");
      if (score + 10 > highScore) {
        setHighScore(score + 10);
        setHighScoreState(score + 10);
        setShowCelebrate(true);
        setNewHighScore(true);
        celebrateTimeout.current = setTimeout(() => setShowCelebrate(false), 1800);
      }
    }
  };

  const resetGame = () => {
    setGrid(generateGrid(bombCount));
    setGameOver(false);
    setScore(0);
    setDiamondsFound(0);
    setMessage("Find the diamonds, avoid the bombs!");
    setShowCelebrate(false);
    setNewHighScore(false);
    if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
  };

  // Calculate remaining bombs and diamonds
  const revealedBombs = grid.filter(cell => cell.revealed && cell.type === BOMB).length;
  const revealedDiamonds = grid.filter(cell => cell.revealed && cell.type === DIAMOND).length;
  const remainingBombs = bombCount - revealedBombs;
  const remainingDiamonds = (GRID_SIZE * GRID_SIZE - bombCount) - revealedDiamonds;

  // Celebration burst effect (emoji burst)
  const EmojiBurst = () => (
    <div style={{ position: 'absolute', left: '50%', top: '120px', transform: 'translateX(-50%)', zIndex: 20, pointerEvents: 'none' }}>
      {CELEBRATE_EMOJIS.map((emoji, i) => (
        <span
          key={i}
          className={`emoji-burst emoji-burst-${i}`}
          style={{
            fontSize: '2.2rem',
            position: 'absolute',
            left: 0,
            top: 0,
            filter: 'drop-shadow(0 0 8px #00DF81)'
          }}
        >{emoji}</span>
      ))}
      <style>{`
        .emoji-burst { opacity: 0; animation: burst 1.2s cubic-bezier(.68,-0.55,.27,1.55) forwards; }
        .emoji-burst-0 { animation-delay: 0.05s; }
        .emoji-burst-1 { animation-delay: 0.15s; }
        .emoji-burst-2 { animation-delay: 0.25s; }
        .emoji-burst-3 { animation-delay: 0.1s; }
        .emoji-burst-4 { animation-delay: 0.2s; }
        .emoji-burst-5 { animation-delay: 0.3s; }
        @keyframes burst {
          0% { opacity: 0; transform: scale(0.5) translate(0,0); }
          20% { opacity: 1; }
          60% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.2) translate(var(--dx, 0px), var(--dy, 0px)); }
        }
        .emoji-burst-0 { --dx: -60px; --dy: -60px; }
        .emoji-burst-1 { --dx: 60px; --dy: -60px; }
        .emoji-burst-2 { --dx: -70px; --dy: 40px; }
        .emoji-burst-3 { --dx: 70px; --dy: 40px; }
        .emoji-burst-4 { --dx: -30px; --dy: 70px; }
        .emoji-burst-5 { --dx: 30px; --dy: 70px; }
      `}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: BG_COLOR, fontFamily: FONT_FAMILY, position: 'relative' }} className="flex flex-col items-center justify-center p-2">
      {showCelebrate && <EmojiBurst />}
      <div className="max-w-md w-full bg-brand-pine/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#0B453A] shadow-2xl flex flex-col items-center relative" style={{ boxShadow: '0 8px 32px 0 rgba(0,223,129,0.15)' }}>
        <div className="w-full flex justify-between items-center mb-3">
          <Link to="/toolkit" className="px-3 py-1.5 rounded-lg font-semibold text-base bg-[var(--color-bg)] text-[var(--color-primary)] border border-[var(--color-primary)] shadow hover:bg-[var(--color-primary-light)] transition-all duration-200" style={{ textShadow: '0 0 6px #00DF81' }}>← Dashboard</Link>
          <span></span>
        </div>
        <h1 className="text-3xl font-semibold text-center mb-2" style={{ color: DIAMOND_COLOR, fontFamily: FONT_FAMILY, letterSpacing: 1, textShadow: '0 0 8px #00DF81' }}>Diamond Quest</h1>
        <div className="text-[var(--color-text-muted)] text-center mb-3 text-base" style={{ fontFamily: FONT_FAMILY }}>Collect as many <span style={{ color: DIAMOND_COLOR }}>{DIAMOND_EMOJI}</span> as you can. Avoid the <span style={{ color: BOMB_COLOR }}>{BOMB_EMOJI}</span>!</div>
        <div className="flex flex-wrap gap-3 mb-3 w-full justify-center items-center text-lg">
          <div className="text-lg" style={{ color: DIAMOND_COLOR, textShadow: '0 0 6px #00DF81' }}>Stardust: <span className="font-semibold">{score}</span></div>
          <div className={`text-lg text-yellow-300 font-semibold transition-all duration-300 ${newHighScore ? 'animate-glow' : ''}`}>High Score: <span>{highScore}</span> {newHighScore && <span className="animate-pulse text-[var(--color-primary)] ml-2">New!</span>}</div>
        </div>
        <div className="flex gap-3 mb-3 items-center text-sm">
          <div className="text-[var(--color-text-muted)]">Bombs left: <span className="font-semibold">{remainingBombs}</span></div>
          <div className="text-[var(--color-primary-hover)]">Diamonds left: <span className="font-semibold">{remainingDiamonds}</span></div>
        </div>
        <div className="flex gap-2 mb-3 items-center text-base">
          <label className="text-[var(--color-text-light)]" htmlFor="bombs">Bombs:</label>
          <select
            id="bombs"
            value={bombCount}
            onChange={e => setBombCount(Number(e.target.value))}
            className="bg-[var(--color-bg-alt)] text-[var(--color-text)] rounded px-2 py-1.5 focus:outline-none border border-[#0B453A]"
            style={{ fontFamily: FONT_FAMILY }}
            disabled={gameOver === false && diamondsFound > 0}
          >
            {BOMB_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="w-full max-w-[340px] aspect-square flex items-center justify-center mb-5">
          <div className="grid grid-cols-5 gap-4 w-full h-full">
            {grid.map((cell, idx) => (
              <button
                key={idx}
                className={`w-16 h-16 flex items-center justify-center border border-[#0B453A] rounded-lg shadow-lg text-2xl md:text-3xl transition-all duration-300 select-none focus:outline-none font-semibold
                  ${cell.revealed ? (cell.type === BOMB ? "bg-red-500/90" : "bg-brand-caribbean-green/90") : "bg-[var(--color-bg-alt)] hover:shadow-[0_0_12px_4px_#00DF81] hover:scale-105"}
                  ${cell.animating ? "animate-flip" : ""}
                  ${cell.justRevealed && cell.type === DIAMOND ? "animate-sparkle" : ""}
                  ${cell.justRevealed && cell.type === BOMB ? "animate-shake" : ""}
                `}
                style={{
                  color: cell.revealed ? (cell.type === DIAMOND ? "#fff" : "#fff") : "#fff",
                  boxShadow: cell.revealed ? (cell.type === DIAMOND ? `0 0 20px 6px ${DIAMOND_COLOR}` : `0 0 20px 6px ${BOMB_COLOR}`) : undefined,
                  transition: "background 0.2s, box-shadow 0.2s, transform 0.2s"
                }}
                onClick={() => handleCellClick(idx)}
                disabled={cell.revealed || gameOver}
                aria-label={cell.type === BOMB ? "Bomb" : "Diamond"}
                onAnimationEnd={() => {
                  if (cell.justRevealed) {
                    const newGrid = grid.slice();
                    newGrid[idx].justRevealed = false;
                    setGrid(newGrid);
                  }
                }}
              >
                {cell.revealed ? (cell.type === BOMB ? BOMB_EMOJI : DIAMOND_EMOJI) : null}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 text-center text-[var(--color-success)] font-mono">
          Find the diamonds, avoid the bombs!
        </div>
        <button
          className="px-6 py-2 rounded font-semibold text-base shadow-md mt-1"
          style={{ background: BUTTON_COLOR, color: "#021B1A", fontFamily: FONT_FAMILY, boxShadow: "0 0 8px 2px #00DF81" }}
          onClick={resetGame}
        >
          Restart
        </button>
        <style>{`
          .animate-glow {
            animation: glow-pulse 1.2s 2;
          }
          @keyframes glow-pulse {
            0% { text-shadow: 0 0 0 #00DF81; }
            50% { text-shadow: 0 0 20px #00DF81, 0 0 10px #facc15; }
            100% { text-shadow: 0 0 0 #00DF81; }
          }
          @keyframes flip {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(180deg); }
          }
          .animate-flip {
            animation: flip 0.4s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes sparkle {
            0% { box-shadow: 0 0 0 0 #00DF81; }
            50% { box-shadow: 0 0 24px 8px #00DF81; }
            100% { box-shadow: 0 0 0 0 #00DF81; }
          }
          .animate-sparkle {
            animation: sparkle 0.6s linear;
          }
          @keyframes shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
            100% { transform: translateX(0); }
          }
          .animate-shake {
            animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
          }
        `}</style>
      </div>
    </div>
  );
};

export default DiamondQuestGame; 

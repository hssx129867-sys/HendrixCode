import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivePlayerId, updatePlayerProgress } from '../utils/storage';
import './LogicPath.css';

type Direction = 'up' | 'down' | 'left' | 'right';

interface Level {
  gridSize: number;
  start: { row: number; col: number };
  goal: { row: number; col: number };
}

const levels: Level[] = [
  { gridSize: 3, start: { row: 0, col: 0 }, goal: { row: 2, col: 2 } },
  { gridSize: 4, start: { row: 0, col: 0 }, goal: { row: 3, col: 3 } },
  { gridSize: 4, start: { row: 0, col: 1 }, goal: { row: 3, col: 2 } },
];

export const LogicPath = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [moves, setMoves] = useState<Direction[]>([]);
  const [message, setMessage] = useState('');
  const [stars, setStars] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPos, setCurrentPos] = useState(levels[0].start);

  const level = levels[currentLevel];

  const addMove = (direction: Direction) => {
    if (!isRunning) {
      setMoves([...moves, direction]);
    }
  };

  const clearMoves = () => {
    setMoves([]);
    setMessage('');
    setCurrentPos(level.start);
  };

  const runMoves = () => {
    setIsRunning(true);
    setMessage('');
    const pos = { ...level.start };
    
    for (const move of moves) {
      switch (move) {
        case 'up':
          pos.row = Math.max(0, pos.row - 1);
          break;
        case 'down':
          pos.row = Math.min(level.gridSize - 1, pos.row + 1);
          break;
        case 'left':
          pos.col = Math.max(0, pos.col - 1);
          break;
        case 'right':
          pos.col = Math.min(level.gridSize - 1, pos.col + 1);
          break;
      }
    }

    setCurrentPos(pos);

    setTimeout(() => {
      if (pos.row === level.goal.row && pos.col === level.goal.col) {
        const newStars = stars + 1;
        setStars(newStars);
        setMessage('🎉 Awesome! You reached the goal!');

        const playerId = getActivePlayerId();
        if (playerId) {
          updatePlayerProgress(playerId, 'logicPath', newStars, currentLevel + 1);
        }
      } else {
        setMessage('Try again! The character didn\'t reach the goal.');
      }
      setIsRunning(false);
    }, 100);
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setMoves([]);
      setMessage('');
      setCurrentPos(levels[currentLevel + 1].start);
    } else {
      setMessage('🎊 Incredible! You completed all levels!');
    }
  };

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < level.gridSize; row++) {
      for (let col = 0; col < level.gridSize; col++) {
        const isStart = row === level.start.row && col === level.start.col && !isRunning;
        const isGoal = row === level.goal.row && col === level.goal.col;
        const isCurrent = row === currentPos.row && col === currentPos.col;

        let cellClass = 'grid-cell';
        if (isGoal) cellClass += ' goal';
        if (isStart) cellClass += ' start';
        if (isCurrent && isRunning) cellClass += ' current';

        grid.push(
          <div key={`${row}-${col}`} className={cellClass}>
            {isGoal && '🎯'}
            {isStart && !isRunning && '🚀'}
            {isCurrent && isRunning && '🚀'}
          </div>
        );
      }
    }
    return grid;
  };

  const getMoveIcon = (direction: Direction) => {
    switch (direction) {
      case 'up':
        return '⬆️';
      case 'down':
        return '⬇️';
      case 'left':
        return '⬅️';
      case 'right':
        return '➡️';
    }
  };

  return (
    <div className="logic-path-container">
      <div className="game-header">
        <h1>🧭 Logic Path</h1>
        <p>Guide the rocket to the goal!</p>
        <div className="level-info">
          Level {currentLevel + 1} of {levels.length} | ⭐ {stars} Stars
        </div>
      </div>

      <div className="game-area">
        <div
          className="grid-container"
          style={{
            gridTemplateColumns: `repeat(${level.gridSize}, 1fr)`,
          }}
        >
          {renderGrid()}
        </div>

        <div className="controls-section">
          <h3>Choose Moves:</h3>
          <div className="direction-buttons">
            <button className="btn-direction" onClick={() => addMove('up')} disabled={isRunning}>
              ⬆️ Up
            </button>
            <div className="horizontal-buttons">
              <button className="btn-direction" onClick={() => addMove('left')} disabled={isRunning}>
                ⬅️ Left
              </button>
              <button className="btn-direction" onClick={() => addMove('right')} disabled={isRunning}>
                ➡️ Right
              </button>
            </div>
            <button className="btn-direction" onClick={() => addMove('down')} disabled={isRunning}>
              ⬇️ Down
            </button>
          </div>

          <div className="moves-display">
            <h4>Your Moves:</h4>
            <div className="moves-list">
              {moves.length === 0 ? (
                <span className="no-moves">No moves yet</span>
              ) : (
                moves.map((move, index) => (
                  <span key={index} className="move-item">
                    {getMoveIcon(move)}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes('Awesome') || message.includes('Incredible')
              ? 'success'
              : 'error'
          }`}
        >
          {message}
        </div>
      )}

      <div className="game-buttons">
        <button className="btn-secondary" onClick={clearMoves} disabled={isRunning}>
          🔄 Clear
        </button>
        <button
          className="btn-primary"
          onClick={runMoves}
          disabled={moves.length === 0 || isRunning}
        >
          ▶️ Run
        </button>
        {message.includes('Awesome') && currentLevel < levels.length - 1 && (
          <button className="btn-primary" onClick={handleNextLevel}>
            ➡️ Next Level
          </button>
        )}
      </div>

      <button className="btn-back" onClick={() => navigate('/play')}>
        ← Back to Game Hub
      </button>
    </div>
  );
};

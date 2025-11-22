import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivePlayerId, updatePlayerProgress } from '../utils/storage';
import './PatternBuilder.css';

const colors = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FFE66D', '#A8E6CF'];
const colorNames = ['Red', 'Teal', 'Mint', 'Yellow', 'Green'];

const levels = [
  { level: 1, patternLength: 3 },
  { level: 2, patternLength: 4 },
  { level: 3, patternLength: 5 },
];

export const PatternBuilder = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [stars, setStars] = useState(0);

  const generatePattern = () => {
    const length = levels[currentLevel].patternLength;
    const newPattern: number[] = [];
    for (let i = 0; i < length; i++) {
      newPattern.push(Math.floor(Math.random() * colors.length));
    }
    setPattern(newPattern);
    setUserPattern([]);
    setMessage('');
  };

  useEffect(() => {
    generatePattern();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel]);

  const handleColorClick = (colorIndex: number) => {
    if (userPattern.length < pattern.length) {
      setUserPattern([...userPattern, colorIndex]);
    }
  };

  const handleClear = () => {
    setUserPattern([]);
    setMessage('');
  };

  const handleSubmit = () => {
    if (userPattern.length !== pattern.length) {
      setMessage('Complete the pattern first!');
      return;
    }

    const isCorrect = userPattern.every((color, index) => color === pattern[index]);

    if (isCorrect) {
      const newStars = stars + 1;
      setStars(newStars);
      setMessage('🎉 Nice job! You matched the pattern!');
      
      const playerId = getActivePlayerId();
      if (playerId) {
        updatePlayerProgress(playerId, 'pattern', newStars, currentLevel + 1);
      }
    } else {
      setMessage('Try again - check the colors carefully!');
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setMessage('🎊 Congratulations! You completed all levels!');
    }
  };

  return (
    <div className="pattern-builder-container">
      <div className="game-header">
        <h1>🎨 Pattern Builder</h1>
        <p>Match the color pattern by clicking the tiles!</p>
        <div className="level-info">
          Level {levels[currentLevel].level} of {levels.length} | ⭐ {stars} Stars
        </div>
      </div>

      <div className="pattern-section">
        <h3>Target Pattern:</h3>
        <div className="pattern-display">
          {pattern.map((colorIndex, index) => (
            <div
              key={index}
              className="pattern-tile"
              style={{ backgroundColor: colors[colorIndex] }}
            >
              {colorNames[colorIndex]}
            </div>
          ))}
        </div>
      </div>

      <div className="pattern-section">
        <h3>Your Pattern:</h3>
        <div className="pattern-display">
          {userPattern.map((colorIndex, index) => (
            <div
              key={index}
              className="pattern-tile"
              style={{ backgroundColor: colors[colorIndex] }}
            >
              {colorNames[colorIndex]}
            </div>
          ))}
          {Array.from({ length: pattern.length - userPattern.length }).map((_, index) => (
            <div key={`empty-${index}`} className="pattern-tile empty">
              ?
            </div>
          ))}
        </div>
      </div>

      <div className="color-picker">
        <h3>Choose Colors:</h3>
        <div className="color-buttons">
          {colors.map((color, index) => (
            <button
              key={index}
              className="color-button"
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(index)}
              disabled={userPattern.length >= pattern.length}
            >
              {colorNames[index]}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('Nice job') || message.includes('Congratulations') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="game-buttons">
        <button className="btn-secondary" onClick={handleClear}>
          🔄 Clear
        </button>
        <button className="btn-primary" onClick={handleSubmit}>
          ✓ Submit
        </button>
        {message.includes('Nice job') && currentLevel < levels.length - 1 && (
          <button className="btn-primary" onClick={handleNextLevel}>
            ➡️ Next Level
          </button>
        )}
        {message.includes('Nice job') && (
          <button className="btn-secondary" onClick={generatePattern}>
            🔄 Try Again
          </button>
        )}
      </div>

      <button className="btn-back" onClick={() => navigate('/play')}>
        ← Back to Game Hub
      </button>
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivePlayerId, updatePlayerProgress } from '../utils/storage';
import './DonkeyKong.css';

interface Level {
  platforms: number;
  barrelSpeed: number;
  barrelFrequency: number;
}

const levels: Level[] = [
  { platforms: 3, barrelSpeed: 3, barrelFrequency: 2000 },
  { platforms: 4, barrelSpeed: 4, barrelFrequency: 1800 },
  { platforms: 5, barrelSpeed: 5, barrelFrequency: 1500 },
];

interface Barrel {
  id: number;
  platform: number;
  position: number;
}

// Game configuration constants
const COLLISION_MIN_POSITION = 45;
const COLLISION_MAX_POSITION = 55;
const GOAL_TIME_MS = 10000; // 10 seconds to win

export const DonkeyKong = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerPlatform, setPlayerPlatform] = useState(0);
  const [barrels, setBarrels] = useState<Barrel[]>([]);
  const [message, setMessage] = useState('');
  const [stars, setStars] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const barrelIdCounter = useRef(0);
  const [gameTime, setGameTime] = useState(0);

  const level = levels[currentLevel];

  useEffect(() => {
    if (!isPlaying) return;

    const gameInterval = setInterval(() => {
      setGameTime((prev) => prev + 100);
    }, 100);

    return () => clearInterval(gameInterval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    // Move barrels
    const moveInterval = setInterval(() => {
      setBarrels((prev) =>
        prev
          .map((barrel) => ({
            ...barrel,
            position: barrel.position + level.barrelSpeed,
          }))
          .filter((barrel) => barrel.position < 100)
      );
    }, 100);

    // Generate barrels
    const barrelInterval = setInterval(() => {
      const platform = Math.floor(Math.random() * level.platforms);
      barrelIdCounter.current += 1;
      const newBarrel = { id: barrelIdCounter.current, platform, position: 0 };
      setBarrels((prev) => [...prev, newBarrel]);
    }, level.barrelFrequency);

    return () => {
      clearInterval(moveInterval);
      clearInterval(barrelInterval);
    };
  }, [isPlaying, level]);

  useEffect(() => {
    if (!isPlaying) return;

    // Check for collisions
    const checkCollision = () => {
      const collision = barrels.some(
        (barrel) =>
          barrel.platform === playerPlatform &&
          barrel.position >= COLLISION_MIN_POSITION &&
          barrel.position <= COLLISION_MAX_POSITION
      );

      if (collision) {
        setIsPlaying(false);
        setMessage('💥 Oh no! A barrel hit you! Try again!');
      }
    };

    checkCollision();
  }, [barrels, playerPlatform, isPlaying]);

  useEffect(() => {
    // Check for level completion
    if (isPlaying && playerPlatform === level.platforms - 1 && gameTime >= GOAL_TIME_MS) {
      setIsPlaying(false);
      const newStars = stars + 1;
      setStars(newStars);
      setMessage('🎉 Amazing! You reached the top!');

      const playerId = getActivePlayerId();
      if (playerId) {
        updatePlayerProgress(playerId, 'donkeyKong', newStars, currentLevel + 1);
      }
    }
  }, [playerPlatform, level.platforms, gameTime, isPlaying, stars, currentLevel]);

  const startGame = () => {
    setPlayerPlatform(0);
    setBarrels([]);
    setMessage('');
    setIsPlaying(true);
    setGameTime(0);
    barrelIdCounter.current = 0;
  };

  const moveUp = () => {
    if (isPlaying && playerPlatform < level.platforms - 1) {
      setPlayerPlatform((prev) => prev + 1);
    }
  };

  const moveDown = () => {
    if (isPlaying && playerPlatform > 0) {
      setPlayerPlatform((prev) => prev - 1);
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setPlayerPlatform(0);
      setBarrels([]);
      setMessage('');
      setGameTime(0);
      barrelIdCounter.current = 0;
    } else {
      setMessage('🎊 Incredible! You completed all levels!');
    }
  };

  const renderPlatforms = () => {
    const platforms = [];
    for (let i = level.platforms - 1; i >= 0; i--) {
      const isPlayerHere = i === playerPlatform;
      const platformBarrels = barrels.filter((b) => b.platform === i);

      platforms.push(
        <div key={i} className="platform">
          <div className="platform-line"></div>
          <div className="platform-content">
            {isPlayerHere && <div className="player">🧗</div>}
            {platformBarrels.map((barrel) => (
              <div
                key={barrel.id}
                className="barrel"
                style={{ left: `${barrel.position}%` }}
              >
                🛢️
              </div>
            ))}
          </div>
          {i === level.platforms - 1 && <div className="goal-flag">🏁</div>}
        </div>
      );
    }
    return platforms;
  };

  return (
    <div className="dk-container">
      <div className="game-header">
        <h1>🦍 Donkey Kong Climb</h1>
        <p>Climb to the top while avoiding barrels!</p>
        <div className="level-info">
          Level {currentLevel + 1} of {levels.length} | ⭐ {stars} Stars
          {isPlaying && <span> | ⏱️ {Math.floor(gameTime / 1000)}s</span>}
        </div>
      </div>

      <div className="game-instructions">
        <p>🎯 Goal: Climb to the top platform and stay there for 10 seconds!</p>
        <p>⚠️ Avoid the rolling barrels - they'll knock you down!</p>
      </div>

      <div className="game-area">
        <div className="game-screen">{renderPlatforms()}</div>

        <div className="controls-section">
          <h3>Controls:</h3>
          {!isPlaying ? (
            <button className="btn-primary btn-large" onClick={startGame}>
              🎮 Start Game
            </button>
          ) : (
            <div className="move-buttons">
              <button className="btn-direction" onClick={moveUp}>
                ⬆️ Climb Up
              </button>
              <button className="btn-direction" onClick={moveDown}>
                ⬇️ Climb Down
              </button>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes('Amazing') || message.includes('Incredible')
              ? 'success'
              : 'error'
          }`}
        >
          {message}
        </div>
      )}

      <div className="game-buttons">
        {!isPlaying && message.includes('Amazing') && currentLevel < levels.length - 1 && (
          <button className="btn-primary" onClick={handleNextLevel}>
            ➡️ Next Level
          </button>
        )}
        {!isPlaying && message.includes('💥') && (
          <button className="btn-secondary" onClick={startGame}>
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

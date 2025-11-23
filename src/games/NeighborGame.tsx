import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivePlayerId, updatePlayerProgress } from '../utils/storage';
import './NeighborGame.css';

interface Position {
  x: number;
  y: number;
}

interface Level {
  id: number;
  keysNeeded: number;
  gridSize: number;
  neighborSpeed: number;
  description: string;
}

const levels: Level[] = [
  {
    id: 1,
    keysNeeded: 3,
    gridSize: 5,
    neighborSpeed: 2000,
    description: 'Find 3 keys to unlock the door!',
  },
  {
    id: 2,
    keysNeeded: 4,
    gridSize: 6,
    neighborSpeed: 1500,
    description: 'The neighbor is faster! Find 4 keys!',
  },
];

type CellType = 'empty' | 'player' | 'neighbor' | 'key' | 'door' | 'hiding';

export const NeighborGame = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [resetCounter, setResetCounter] = useState(0);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [neighborPos, setNeighborPos] = useState<Position>({ x: 4, y: 4 });
  const [keysCollected, setKeysCollected] = useState(0);
  const [keyPositions, setKeyPositions] = useState<Position[]>([]);
  const [doorPos, setDoorPos] = useState<Position>({ x: 4, y: 0 });
  const [hidingSpots, setHidingSpots] = useState<Position[]>([]);
  const [isHiding, setIsHiding] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'caught' | 'won' | 'levelComplete'>('playing');
  const [message, setMessage] = useState('');
  const [stars, setStars] = useState(0);
  const [moves, setMoves] = useState(0);

  const level = levels[currentLevel];

  // Initialize level
  useEffect(() => {
    const size = level.gridSize;
    
    // Generate random key positions
    const keys: Position[] = [];
    while (keys.length < level.keysNeeded) {
      const pos = {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
      };
      // Avoid placing keys on player, neighbor, or door start positions
      if (
        !(pos.x === 0 && pos.y === 0) &&
        !(pos.x === size - 1 && pos.y === size - 1) &&
        !(pos.x === size - 1 && pos.y === 0) &&
        !keys.some(k => k.x === pos.x && k.y === pos.y)
      ) {
        keys.push(pos);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKeyPositions(keys);

    // Generate hiding spots
    const hiding: Position[] = [];
    const numHiding = Math.floor(size / 2);
    while (hiding.length < numHiding) {
      const pos = {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
      };
      if (
        !(pos.x === 0 && pos.y === 0) &&
        !(pos.x === size - 1 && pos.y === size - 1) &&
        !(pos.x === size - 1 && pos.y === 0) &&
        !keys.some(k => k.x === pos.x && k.y === pos.y) &&
        !hiding.some(h => h.x === pos.x && h.y === pos.y)
      ) {
        hiding.push(pos);
      }
    }
    setHidingSpots(hiding);

    // Reset positions
    setPlayerPos({ x: 0, y: 0 });
    setNeighborPos({ x: size - 1, y: size - 1 });
    setDoorPos({ x: size - 1, y: 0 });
    setKeysCollected(0);
    setGameState('playing');
    setMessage('');
    setIsHiding(false);
    setMoves(0);
  }, [currentLevel, resetCounter, level.gridSize, level.keysNeeded]);

  // Neighbor AI movement
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (isHiding) return; // Neighbor can't see you when hiding

    const moveNeighbor = setInterval(() => {
      setNeighborPos(prev => {
        const dx = playerPos.x - prev.x;
        const dy = playerPos.y - prev.y;
        
        const newPos = { ...prev };
        
        // Move toward player
        if (Math.abs(dx) > Math.abs(dy)) {
          newPos.x += dx > 0 ? 1 : -1;
        } else if (dy !== 0) {
          newPos.y += dy > 0 ? 1 : -1;
        } else if (dx !== 0) {
          newPos.x += dx > 0 ? 1 : -1;
        }

        // Keep in bounds
        newPos.x = Math.max(0, Math.min(level.gridSize - 1, newPos.x));
        newPos.y = Math.max(0, Math.min(level.gridSize - 1, newPos.y));

        return newPos;
      });
    }, level.neighborSpeed);

    return () => clearInterval(moveNeighbor);
  }, [gameState, playerPos, level.gridSize, level.neighborSpeed, isHiding]);

  // Check if caught
  useEffect(() => {
    if (gameState === 'playing' && !isHiding) {
      if (playerPos.x === neighborPos.x && playerPos.y === neighborPos.y) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGameState('caught');
        setMessage('😱 The neighbor caught you! Try again!');
      }
    }
  }, [playerPos, neighborPos, gameState, isHiding]);

  const movePlayer = (dx: number, dy: number) => {
    if (gameState !== 'playing') return;

    const newPos = {
      x: Math.max(0, Math.min(level.gridSize - 1, playerPos.x + dx)),
      y: Math.max(0, Math.min(level.gridSize - 1, playerPos.y + dy)),
    };

    setPlayerPos(newPos);
    setMoves(prev => prev + 1);

    // Check if player is on hiding spot
    const onHiding = hidingSpots.some(h => h.x === newPos.x && h.y === newPos.y);
    setIsHiding(onHiding);

    // Check for key collection
    const keyIndex = keyPositions.findIndex(k => k.x === newPos.x && k.y === newPos.y);
    let newKeysCollected = keysCollected;
    if (keyIndex !== -1) {
      newKeysCollected = keysCollected + 1;
      setKeysCollected(newKeysCollected);
      setKeyPositions(prev => prev.filter((_, i) => i !== keyIndex));
      setMessage(`🔑 Key found! ${newKeysCollected}/${level.keysNeeded}`);
      setTimeout(() => setMessage(''), 2000);
    }

    // Check for door (level completion)
    if (newPos.x === doorPos.x && newPos.y === doorPos.y && newKeysCollected >= level.keysNeeded) {
      const earnedStars = moves < level.gridSize * 3 ? 3 : moves < level.gridSize * 5 ? 2 : 1;
      const newStars = stars + earnedStars;
      setStars(newStars);
      
      const playerId = getActivePlayerId();
      if (playerId) {
        updatePlayerProgress(playerId, 'neighborGame', newStars, currentLevel + 1);
      }

      if (currentLevel < levels.length - 1) {
        setGameState('levelComplete');
        setMessage(`🎉 Level ${currentLevel + 1} Complete! +${earnedStars} stars!`);
      } else {
        setGameState('won');
        setMessage('🎊 You escaped! All levels complete!');
      }
    } else if (newPos.x === doorPos.x && newPos.y === doorPos.y) {
      setMessage('🚪 Need more keys to unlock the door!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        movePlayer(0, -1);
        break;
      case 'ArrowDown':
      case 's':
        movePlayer(0, 1);
        break;
      case 'ArrowLeft':
      case 'a':
        movePlayer(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
        movePlayer(1, 0);
        break;
    }
  };

  const resetLevel = () => {
    setResetCounter(prev => prev + 1);
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  const getCellContent = (x: number, y: number): CellType => {
    if (playerPos.x === x && playerPos.y === y) return 'player';
    if (neighborPos.x === x && neighborPos.y === y) return 'neighbor';
    if (keyPositions.some(k => k.x === x && k.y === y)) return 'key';
    if (doorPos.x === x && doorPos.y === y) return 'door';
    if (hidingSpots.some(h => h.x === x && h.y === y)) return 'hiding';
    return 'empty';
  };

  const getCellEmoji = (type: CellType): string => {
    switch (type) {
      case 'player': return '🧒';
      case 'neighbor': return '👨';
      case 'key': return '🔑';
      case 'door': return '🚪';
      case 'hiding': return '📦';
      default: return '';
    }
  };

  return (
    <div className="neighbor-game-container" onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="game-header">
        <h1>🏠 Neighbor Stealth</h1>
        <p>Sneak into the house and find keys to escape!</p>
        <div className="level-info">
          Level {currentLevel + 1} of {levels.length} | ⭐ {stars} Stars | 👣 {moves} Moves
        </div>
      </div>

      <div className="level-description">
        <p>{level.description}</p>
        <p>🔑 Keys: {keysCollected}/{level.keysNeeded} {isHiding && '| 🙈 Hiding!'}</p>
      </div>

      <div className="game-grid" style={{
        gridTemplateColumns: `repeat(${level.gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${level.gridSize}, 1fr)`,
      }}>
        {Array.from({ length: level.gridSize * level.gridSize }).map((_, index) => {
          const x = index % level.gridSize;
          const y = Math.floor(index / level.gridSize);
          const cellType = getCellContent(x, y);
          const emoji = getCellEmoji(cellType);
          
          return (
            <div
              key={`${x}-${y}`}
              className={`grid-cell ${cellType} ${isHiding && cellType === 'player' ? 'hiding-active' : ''}`}
            >
              {emoji}
            </div>
          );
        })}
      </div>

      <div className="controls-hint">
        <p>🎮 Use Arrow Keys or WASD to move</p>
        <p>📦 Hide in boxes to avoid the neighbor!</p>
      </div>

      {message && (
        <div className={`message ${gameState === 'caught' ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="game-buttons">
        {gameState === 'playing' && (
          <>
            <button className="btn-control" onClick={() => movePlayer(0, -1)}>⬆️</button>
            <div className="arrow-row">
              <button className="btn-control" onClick={() => movePlayer(-1, 0)}>⬅️</button>
              <button className="btn-control" onClick={() => movePlayer(0, 1)}>⬇️</button>
              <button className="btn-control" onClick={() => movePlayer(1, 0)}>➡️</button>
            </div>
          </>
        )}
        
        {gameState === 'caught' && (
          <button className="btn-primary" onClick={resetLevel}>
            🔄 Try Again
          </button>
        )}
        
        {gameState === 'levelComplete' && (
          <button className="btn-primary" onClick={nextLevel}>
            ➡️ Next Level
          </button>
        )}
        
        {gameState === 'won' && (
          <button className="btn-primary" onClick={() => navigate('/play')}>
            🏆 Back to Game Hub
          </button>
        )}
      </div>

      <button className="btn-back" onClick={() => navigate('/play')}>
        ← Back to Game Hub
      </button>
    </div>
  );
};

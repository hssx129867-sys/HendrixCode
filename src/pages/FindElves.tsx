import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getActivePlayerId,
  getPlayers,
  getChristmasProgress,
  markElfFound,
  resetElvesGame,
} from '../utils/storage';
import type { Player, ChristmasProgress, ElfLocation } from '../types';
import { Avatar } from '../components/Avatar';
import './FindElves.css';

export const FindElves = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [progress, setProgress] = useState<ChristmasProgress | null>(null);
  const [selectedElf, setSelectedElf] = useState<ElfLocation | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const playerId = getActivePlayerId();
    if (!playerId) {
      navigate('/players');
      return;
    }

    const players = getPlayers();
    const foundPlayer = players.find((p) => p.id === playerId);
    if (foundPlayer) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlayer(foundPlayer);
      const christmasProgress = getChristmasProgress(playerId);
      setProgress(christmasProgress);
    } else {
      navigate('/players');
    }
  }, [navigate]);

  const handleFindElf = (elf: ElfLocation) => {
    if (!player || elf.found) return;

    markElfFound(player.id, elf.id);
    const updatedProgress = getChristmasProgress(player.id);
    setProgress(updatedProgress);
    setSelectedElf(null);

    // Check if all elves are found
    const allFound = updatedProgress.elvesFound.every((e) => e.found);
    if (allFound) {
      setShowConfetti(true);
    }
  };

  const handleReset = () => {
    if (!player) return;

    if (window.confirm('Are you sure you want to start over? This will reset all found elves!')) {
      resetElvesGame(player.id);
      const updatedProgress = getChristmasProgress(player.id);
      setProgress(updatedProgress);
      setShowConfetti(false);
    }
  };

  if (!player || !progress) {
    return <div>Loading...</div>;
  }

  const foundCount = progress.elvesFound.filter((e) => e.found).length;
  const totalCount = progress.elvesFound.length;
  const allFound = foundCount === totalCount;

  return (
    <div className="find-elves-container">
      <div className="elves-header">
        <Avatar type={player.avatarType} size="medium" />
        <div className="elves-info">
          <h1>🎄 Find the Elves!</h1>
          <p className="elves-subtitle">Can you find all 12 hidden elves?</p>
        </div>
      </div>

      <div className="progress-display">
        <div className="stars-collected">
          <div className="star-icon">⭐</div>
          <div className="star-count">{progress.starsCollected} / {totalCount}</div>
          <div className="star-label">Stars Collected</div>
        </div>

        <div className="christmas-tree">
          <div className="tree-top">🌟</div>
          <div className="tree-body">
            {progress.elvesFound.map((elf) => (
              elf.found ? <div key={elf.id} className="tree-star">⭐</div> : null
            ))}
          </div>
          <div className="tree-trunk">🪵</div>
        </div>
      </div>

      {allFound && showConfetti && (
        <div className="victory-message">
          <div className="confetti">🎉</div>
          <h2>🎊 Congratulations! 🎊</h2>
          <p>You found all the elves and collected the Spirit of Christmas!</p>
          <div className="spirit-badge">✨ Spirit of Christmas ✨</div>
        </div>
      )}

      <div className="game-instructions">
        <h3>📱 How to Play</h3>
        <p>Click on an elf to see their hint, then go find them in your house! When you find them, click "Found It!" to collect a star for your Christmas tree.</p>
      </div>

      <div className="elves-grid">
        {progress.elvesFound.map((elf) => (
          <div
            key={elf.id}
            className={`elf-card ${elf.found ? 'found' : ''} ${selectedElf?.id === elf.id ? 'selected' : ''}`}
            onClick={() => setSelectedElf(selectedElf?.id === elf.id ? null : elf)}
          >
            <div className="elf-icon">{elf.found ? '✅' : '🎅'}</div>
            <div className="elf-name">{elf.name}</div>
            <div className="elf-location">{elf.location}</div>
            {selectedElf?.id === elf.id && !elf.found && (
              <div className="elf-details">
                <p className="elf-hint">💡 {elf.hint}</p>
                <button
                  className="btn-found"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFindElf(elf);
                  }}
                >
                  🎁 Found It!
                </button>
              </div>
            )}
            {elf.found && elf.foundAt && (
              <div className="found-time">
                Found! ⭐
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="nav-buttons">
        <button className="btn-back" onClick={() => navigate('/christmas-lab')}>
          ← Back to Christmas Lab
        </button>
        {foundCount > 0 && (
          <button className="btn-reset" onClick={handleReset}>
            🔄 Start Over
          </button>
        )}
      </div>
    </div>
  );
};

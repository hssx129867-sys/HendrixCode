import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPlayers, getActivePlayerId } from '../utils/storage';
import type { Player } from '../types';
import { Avatar } from '../components/Avatar';
import './Play.css';

const games = [
  {
    id: 'pattern',
    title: '🎨 Pattern Builder',
    description: 'Match the color patterns!',
  },
  {
    id: 'bugSquash',
    title: '🐛 Bug Squash',
    description: 'Find and squash the bugs!',
  },
  {
    id: 'logicPath',
    title: '🧭 Logic Path',
    description: 'Guide the character to the goal!',
  },
];

export const Play = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    // Load player data
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
    } else {
      navigate('/players');
    }
  }, [navigate]);

  if (!player) {
    return <div>Loading...</div>;
  }

  const getTotalStars = () => {
    return Object.values(player.progress).reduce((sum, prog) => sum + prog.stars, 0);
  };

  const getTotalLevels = () => {
    return Object.values(player.progress).reduce((sum, prog) => sum + prog.levelsCompleted, 0);
  };

  return (
    <div className="play-container">
      <div className="player-header">
        <Avatar type={player.avatarType} size="large" />
        <div className="player-info">
          <h1>{player.name}'s Game Hub</h1>
          <div className="stats">
            <span>⭐ {getTotalStars()} Stars</span>
            <span>🏆 {getTotalLevels()} Levels</span>
          </div>
        </div>
      </div>

      <div className="games-grid">
        {games.map((game) => {
          const gameProgress = player.progress[game.id];
          return (
            <div key={game.id} className="game-card">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              {gameProgress && (
                <div className="game-progress">
                  <span>⭐ {gameProgress.stars}</span>
                  <span>📊 Level {gameProgress.levelsCompleted}</span>
                </div>
              )}
              <button
                className="btn-primary"
                onClick={() => navigate(`/game/${game.id}`)}
              >
                Play Now!
              </button>
            </div>
          );
        })}
      </div>

      <div className="nav-buttons">
        <button className="btn-secondary" onClick={() => navigate('/profile')}>
          👤 View Profile
        </button>
        <button className="btn-secondary" onClick={() => navigate('/christmas-lab')}>
          🎄 Christmas Lab
        </button>
        <button className="btn-back" onClick={() => navigate('/players')}>
          ← Change Player
        </button>
      </div>
    </div>
  );
};

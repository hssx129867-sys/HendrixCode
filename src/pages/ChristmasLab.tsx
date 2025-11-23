import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getActivePlayerId, getPlayers, getDaysUntilChristmas } from '../utils/storage';
import type { Player } from '../types';
import { Avatar } from '../components/Avatar';
import './ChristmasLab.css';

export const ChristmasLab = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const daysUntilChristmas = getDaysUntilChristmas();

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
    } else {
      navigate('/players');
    }
  }, [navigate]);

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <div className="christmas-lab-container">
      <div className="christmas-header">
        <Avatar type={player.avatarType} size="large" />
        <div className="christmas-info">
          <h1>🎄 {player.name}'s Christmas Lab 🎄</h1>
          <div className="countdown">
            <span className="countdown-number">{daysUntilChristmas}</span>
            <span className="countdown-text">days until Christmas!</span>
          </div>
        </div>
      </div>

      <div className="christmas-tools-grid">
        <div className="christmas-tool-card">
          <div className="tool-icon">🎁</div>
          <h3>Christmas List</h3>
          <p>Create your wish list for Santa!</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/christmas-list')}
          >
            Make Your List
          </button>
        </div>

        <div className="christmas-tool-card">
          <div className="tool-icon">🎅</div>
          <h3>Track Santa</h3>
          <p>See where Santa is right now!</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/santa-tracker')}
          >
            Track Santa
          </button>
        </div>

        <div className="christmas-tool-card">
          <div className="tool-icon">😄</div>
          <h3>Christmas Jokes</h3>
          <p>Laugh with festive jokes!</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/christmas-jokes')}
          >
            Tell Me a Joke
          </button>
        </div>

        <div className="christmas-tool-card">
          <div className="tool-icon">🎄</div>
          <h3>Break Ideas</h3>
          <p>Fun things to do this holiday!</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/christmas-ideas')}
          >
            Get Ideas
          </button>
        </div>

        <div className="christmas-tool-card">
          <div className="tool-icon">🎁</div>
          <h3>Secret Santa</h3>
          <p>Spin the wheel to assign Secret Santas!</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/secret-santa')}
          >
            Start Secret Santa
          </button>
        </div>

        <div className="christmas-tool-card highlight">
          <div className="tool-icon">🎅</div>
          <h3>Find the Elves!</h3>
          <p>Find all 12 elves hiding in your house!</p>
          <button
            className="btn-highlight"
            onClick={() => navigate('/find-elves')}
          >
            🎮 Start Hunt!
          </button>
        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn-back" onClick={() => navigate('/play')}>
          ← Back to Game Zone
        </button>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          🏠 Home
        </button>
      </div>
    </div>
  );
};

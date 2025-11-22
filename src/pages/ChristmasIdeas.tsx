import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getActivePlayerId, getPlayers, getChristmasBreakIdeas } from '../utils/storage';
import type { Player } from '../types';
import { Avatar } from '../components/Avatar';
import './ChristmasIdeas.css';

export const ChristmasIdeas = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [ideas] = useState<string[]>(getChristmasBreakIdeas());
  const [completedIdeas, setCompletedIdeas] = useState<Set<number>>(new Set());

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

    // Load completed ideas from localStorage
    const saved = localStorage.getItem(`christmas-ideas-${playerId}`);
    if (saved) {
      setCompletedIdeas(new Set(JSON.parse(saved)));
    }
  }, [navigate]);

  const toggleIdea = (index: number) => {
    const newCompleted = new Set(completedIdeas);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedIdeas(newCompleted);

    // Save to localStorage
    if (player) {
      localStorage.setItem(`christmas-ideas-${player.id}`, JSON.stringify(Array.from(newCompleted)));
    }
  };

  if (!player) {
    return <div>Loading...</div>;
  }

  const completedCount = completedIdeas.size;
  const totalCount = ideas.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="christmas-ideas-container">
      <div className="ideas-header">
        <Avatar type={player.avatarType} size="medium" />
        <div className="ideas-info">
          <h1>🎄 Christmas Break Ideas!</h1>
          <p className="ideas-subtitle">Fun things to do this holiday season!</p>
        </div>
      </div>

      <div className="progress-section">
        <h3>Your Christmas Adventure Progress</h3>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
            {progressPercentage > 0 && <span className="progress-text">{progressPercentage}%</span>}
          </div>
        </div>
        <p className="progress-stats">
          {completedCount} of {totalCount} activities completed! 🌟
        </p>
      </div>

      <div className="ideas-grid">
        {ideas.map((idea, index) => (
          <div
            key={index}
            className={`idea-card ${completedIdeas.has(index) ? 'completed' : ''}`}
            onClick={() => toggleIdea(index)}
          >
            <div className="idea-checkbox">
              {completedIdeas.has(index) ? '✅' : '⬜'}
            </div>
            <div className="idea-text">
              {idea}
            </div>
          </div>
        ))}
      </div>

      {completedCount === totalCount && (
        <div className="completion-message">
          <div className="completion-icon">🎉</div>
          <h2>Wow! You've done all the activities!</h2>
          <p>You're a Christmas champion! 🏆</p>
        </div>
      )}

      <div className="nav-buttons">
        <button className="btn-back" onClick={() => navigate('/christmas-lab')}>
          ← Back to Christmas Lab
        </button>
      </div>
    </div>
  );
};

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getActivePlayerId, getPlayers, getChristmasJokes } from '../utils/storage';
import type { Player, ChristmasJoke } from '../types';
import { Avatar } from '../components/Avatar';
import './ChristmasJokes.css';

export const ChristmasJokes = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [jokes] = useState<ChristmasJoke[]>(getChristmasJokes());
  const [currentJokeIndex, setCurrentJokeIndex] = useState(0);
  const [showPunchline, setShowPunchline] = useState(false);

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

  const handleNextJoke = () => {
    setShowPunchline(false);
    setCurrentJokeIndex((prev) => (prev + 1) % jokes.length);
  };

  const handlePreviousJoke = () => {
    setShowPunchline(false);
    setCurrentJokeIndex((prev) => (prev - 1 + jokes.length) % jokes.length);
  };

  const handleShowPunchline = () => {
    setShowPunchline(true);
  };

  if (!player) {
    return <div>Loading...</div>;
  }

  const currentJoke = jokes[currentJokeIndex];

  return (
    <div className="christmas-jokes-container">
      <div className="jokes-header">
        <Avatar type={player.avatarType} size="medium" />
        <div className="jokes-info">
          <h1>😄 Christmas Jokes!</h1>
          <p className="jokes-subtitle">Get ready to laugh!</p>
        </div>
      </div>

      <div className="joke-display">
        <div className="joke-counter">
          Joke {currentJokeIndex + 1} of {jokes.length}
        </div>

        <div className="joke-card">
          <div className="joke-icon">🎅</div>
          <div className="joke-question">
            <p>{currentJoke.joke}</p>
          </div>

          {!showPunchline ? (
            <button className="btn-reveal" onClick={handleShowPunchline}>
              🎁 Show Answer!
            </button>
          ) : (
            <div className="punchline-reveal">
              <div className="punchline-divider">✨</div>
              <p className="punchline-text">{currentJoke.punchline}</p>
              <div className="laugh-emoji">😂</div>
            </div>
          )}
        </div>

        <div className="joke-navigation">
          <button className="btn-nav" onClick={handlePreviousJoke}>
            ← Previous
          </button>
          <button className="btn-nav" onClick={handleNextJoke}>
            Next →
          </button>
        </div>
      </div>

      <div className="all-jokes-section">
        <h3>🎄 All the Jokes!</h3>
        <div className="jokes-list">
          {jokes.map((joke, index) => (
            <div key={joke.id} className={`joke-item ${index === currentJokeIndex ? 'active' : ''}`}>
              <div className="joke-item-number">{index + 1}</div>
              <div className="joke-item-content">
                <p className="joke-item-question">{joke.joke}</p>
                <p className="joke-item-answer">{joke.punchline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn-back" onClick={() => navigate('/christmas-lab')}>
          ← Back to Christmas Lab
        </button>
      </div>
    </div>
  );
};

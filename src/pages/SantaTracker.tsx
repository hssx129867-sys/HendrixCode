import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getActivePlayerId, getPlayers, getSantaLocation, getChristmasCountdown, getSantaAge, type ChristmasCountdown } from '../utils/storage';
import type { Player, SantaLocation } from '../types';
import { Avatar } from '../components/Avatar';
import './SantaTracker.css';

export const SantaTracker = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [santaLocation, setSantaLocation] = useState<SantaLocation | null>(null);
  const [countdown, setCountdown] = useState<ChristmasCountdown>(getChristmasCountdown());
  const santaAge = getSantaAge();

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

    // Get Santa's location
    setSantaLocation(getSantaLocation());

    // Update Santa's location every 30 seconds
    const locationInterval = setInterval(() => {
      setSantaLocation(getSantaLocation());
    }, 30000);

    // Update countdown every second
    const countdownInterval = setInterval(() => {
      setCountdown(getChristmasCountdown());
    }, 1000);

    return () => {
      clearInterval(locationInterval);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  const handleRefresh = () => {
    setSantaLocation(getSantaLocation());
  };

  if (!player || !santaLocation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="santa-tracker-container">
      <div className="tracker-header">
        <Avatar type={player.avatarType} size="medium" />
        <div className="tracker-info">
          <h1>🎅 Track Santa!</h1>
          <div className="countdown-detailed">
            <div className="countdown-item">
              <span className="countdown-value">{countdown.days}</span>
              <span className="countdown-unit">days</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-value">{countdown.hours}</span>
              <span className="countdown-unit">hours</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-value">{countdown.minutes}</span>
              <span className="countdown-unit">mins</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-value">{countdown.seconds}</span>
              <span className="countdown-unit">secs</span>
            </div>
          </div>
          <p className="countdown-label">until Christmas!</p>
        </div>
      </div>

      <div className="santa-map">
        <div className="santa-icon-large">🎅</div>
        <h2 className="santa-location">{santaLocation.location}</h2>
        <p className="santa-activity">{santaLocation.activity}</p>
        
        <button className="btn-refresh" onClick={handleRefresh}>
          🔄 Check Again
        </button>
      </div>

      <div className="santa-facts">
        <h3>🎄 Did You Know?</h3>
        <div className="facts-grid">
          <div className="fact-card highlight">
            <div className="fact-icon">🎂</div>
            <p>Santa is about {santaAge} years old! He was born as St. Nicholas around 270 AD and still loves delivering presents!</p>
          </div>
          <div className="fact-card">
            <div className="fact-icon">🦌</div>
            <p>Santa has 9 reindeer: Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner, Blitzen, and Rudolph!</p>
          </div>
          <div className="fact-card">
            <div className="fact-icon">🎁</div>
            <p>Santa visits over 500 million children around the world on Christmas Eve!</p>
          </div>
          <div className="fact-card">
            <div className="fact-icon">🍪</div>
            <p>Santa loves cookies and milk! Don't forget to leave some out on Christmas Eve!</p>
          </div>
          <div className="fact-card">
            <div className="fact-icon">🏠</div>
            <p>Santa's workshop is at the North Pole where elves make toys all year long!</p>
          </div>
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

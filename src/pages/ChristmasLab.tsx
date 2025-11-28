import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getActivePlayerId, getPlayers, getDaysUntilChristmas } from '../utils/storage';
import type { Player } from '../types';
import { Avatar } from '../components/Avatar';
import { CockpitButton, CockpitPanel, CockpitPanelBody, CockpitContainer } from '../design-system';
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
    <div className="christmas-lab-page">
      <CockpitContainer size="xl">
        {/* Header */}
        <CockpitPanel variant="elevated" glow className="christmas-lab-header">
          <CockpitPanelBody>
            <div className="header-content">
              <Avatar type={player.avatarType} size="large" />
              <div className="header-info">
                <h1>🎄 {player.name}'s Christmas Lab 🎄</h1>
                <div className="countdown">
                  <span className="countdown-number">{daysUntilChristmas}</span>
                  <span className="countdown-text">days until Christmas!</span>
                </div>
              </div>
            </div>
          </CockpitPanelBody>
        </CockpitPanel>

        {/* Tools Grid */}
        <div className="christmas-tools-grid">
          <CockpitPanel variant="outlined" className="christmas-tool-panel">
            <CockpitPanelBody>
              <div className="tool-icon">🎁</div>
              <h3>Christmas List</h3>
              <p>Create your wish list for Santa!</p>
              <CockpitButton
                size="large"
                onClick={() => navigate('/christmas-list')}
              >
                Make Your List
              </CockpitButton>
            </CockpitPanelBody>
          </CockpitPanel>

          <CockpitPanel variant="outlined" className="christmas-tool-panel">
            <CockpitPanelBody>
              <div className="tool-icon">🎅</div>
              <h3>Track Santa</h3>
              <p>See where Santa is right now!</p>
              <CockpitButton
                size="large"
                onClick={() => navigate('/santa-tracker')}
              >
                Track Santa
              </CockpitButton>
            </CockpitPanelBody>
          </CockpitPanel>

          <CockpitPanel variant="outlined" className="christmas-tool-panel">
            <CockpitPanelBody>
              <div className="tool-icon">😄</div>
              <h3>Christmas Jokes</h3>
              <p>Laugh with festive jokes!</p>
              <CockpitButton
                size="large"
                onClick={() => navigate('/christmas-jokes')}
              >
                Tell Me a Joke
              </CockpitButton>
            </CockpitPanelBody>
          </CockpitPanel>

          <CockpitPanel variant="outlined" className="christmas-tool-panel">
            <CockpitPanelBody>
              <div className="tool-icon">🎄</div>
              <h3>Break Ideas</h3>
              <p>Fun things to do this holiday!</p>
              <CockpitButton
                size="large"
                onClick={() => navigate('/christmas-ideas')}
              >
                Get Ideas
              </CockpitButton>
            </CockpitPanelBody>
          </CockpitPanel>

          <CockpitPanel variant="outlined" className="christmas-tool-panel">
            <CockpitPanelBody>
              <div className="tool-icon">🎁</div>
              <h3>Secret Santa</h3>
              <p>Spin the wheel to assign Secret Santas!</p>
              <CockpitButton
                size="large"
                onClick={() => navigate('/secret-santa')}
              >
                Start Secret Santa
              </CockpitButton>
            </CockpitPanelBody>
          </CockpitPanel>

          <CockpitPanel variant="elevated" pulse className="christmas-tool-panel highlight">
            <CockpitPanelBody>
              <div className="tool-icon">🎅</div>
              <h3>Find the Elves!</h3>
              <p>Find all 12 elves hiding in your house!</p>
              <CockpitButton
                variant="primary"
                size="large"
                onClick={() => navigate('/find-elves')}
              >
                🎮 Start Hunt!
              </CockpitButton>
            </CockpitPanelBody>
          </CockpitPanel>
        </div>

        {/* Navigation */}
        <div className="nav-buttons">
          <CockpitButton onClick={() => navigate('/play')}>
            ← Back to Game Zone
          </CockpitButton>
          <CockpitButton onClick={() => navigate('/')}>
            🏠 Home
          </CockpitButton>
        </div>
      </CockpitContainer>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivePlayerId, updatePlayerProgress } from '../utils/storage';
import './BugSquash.css';

interface Rule {
  description: string;
  check: (num: number) => boolean;
}

const rules: Rule[] = [
  {
    description: 'Squash all EVEN bugs',
    check: (num) => num % 2 === 0,
  },
  {
    description: 'Squash all ODD bugs',
    check: (num) => num % 2 !== 0,
  },
  {
    description: 'Squash bugs greater than 5',
    check: (num) => num > 5,
  },
  {
    description: 'Squash bugs less than or equal to 5',
    check: (num) => num <= 5,
  },
];

export const BugSquash = () => {
  const navigate = useNavigate();
  const [currentRule, setCurrentRule] = useState(0);
  const [selectedBugs, setSelectedBugs] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState('');
  const [stars, setStars] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const bugs = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    // Reset state when rule changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedBugs(new Set());
    setMessage('');
    setShowResult(false);
  }, [currentRule]);

  const handleBugClick = (bugNum: number) => {
    if (showResult) return;

    const newSelected = new Set(selectedBugs);
    if (newSelected.has(bugNum)) {
      newSelected.delete(bugNum);
    } else {
      newSelected.add(bugNum);
    }
    setSelectedBugs(newSelected);
  };

  const handleSubmit = () => {
    const rule = rules[currentRule];
    const correctBugs = bugs.filter(rule.check);
    const correctSet = new Set(correctBugs);

    const isCorrect =
      correctSet.size === selectedBugs.size &&
      Array.from(selectedBugs).every((bug) => correctSet.has(bug));

    setShowResult(true);

    if (isCorrect) {
      const newStars = stars + 1;
      setStars(newStars);
      setMessage('🎉 Perfect! You squashed all the right bugs!');

      const playerId = getActivePlayerId();
      if (playerId) {
        updatePlayerProgress(playerId, 'bugSquash', newStars, currentRule + 1);
      }
    } else {
      setMessage('Try again! Some bugs are still wrong.');
      // Highlight incorrect selections
    }
  };

  const handleNextLevel = () => {
    if (currentRule < rules.length - 1) {
      setCurrentRule(currentRule + 1);
    } else {
      setMessage('🎊 Amazing! You completed all levels!');
    }
  };

  const handleReset = () => {
    setSelectedBugs(new Set());
    setMessage('');
    setShowResult(false);
  };

  const isBugCorrect = (bugNum: number) => {
    if (!showResult) return null;
    const rule = rules[currentRule];
    const shouldBeSelected = rule.check(bugNum);
    const isSelected = selectedBugs.has(bugNum);
    return shouldBeSelected === isSelected;
  };

  return (
    <div className="bug-squash-container">
      <div className="game-header">
        <h1>🐛 Bug Squash</h1>
        <p>Click the bugs that match the rule!</p>
        <div className="level-info">
          Level {currentRule + 1} of {rules.length} | ⭐ {stars} Stars
        </div>
      </div>

      <div className="rule-section">
        <h3>Rule:</h3>
        <div className="rule-display">{rules[currentRule].description}</div>
      </div>

      <div className="bugs-grid">
        {bugs.map((bugNum) => {
          const isSelected = selectedBugs.has(bugNum);
          const correctness = isBugCorrect(bugNum);
          let className = 'bug-tile';
          if (isSelected) className += ' selected';
          if (correctness === true) className += ' correct';
          if (correctness === false) className += ' incorrect';

          return (
            <button
              key={bugNum}
              className={className}
              onClick={() => handleBugClick(bugNum)}
              disabled={showResult}
            >
              <div className="bug-icon">🐛</div>
              <div className="bug-number">{bugNum}</div>
            </button>
          );
        })}
      </div>

      {message && (
        <div
          className={`message ${
            message.includes('Perfect') || message.includes('Amazing')
              ? 'success'
              : 'error'
          }`}
        >
          {message}
        </div>
      )}

      <div className="game-buttons">
        {!showResult ? (
          <>
            <button className="btn-secondary" onClick={handleReset}>
              🔄 Clear
            </button>
            <button className="btn-primary" onClick={handleSubmit}>
              ✓ Submit
            </button>
          </>
        ) : (
          <>
            {message.includes('Perfect') && currentRule < rules.length - 1 && (
              <button className="btn-primary" onClick={handleNextLevel}>
                ➡️ Next Level
              </button>
            )}
            <button className="btn-secondary" onClick={handleReset}>
              🔄 Try Again
            </button>
          </>
        )}
      </div>

      <button className="btn-back" onClick={() => navigate('/play')}>
        ← Back to Game Hub
      </button>
    </div>
  );
};

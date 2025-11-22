import { useParams, Navigate } from 'react-router-dom';
import { PatternBuilder } from '../games/PatternBuilder';
import { BugSquash } from '../games/BugSquash';
import { LogicPath } from '../games/LogicPath';
import { BrainRot } from '../games/BrainRot';

export const Game = () => {
  const { gameId } = useParams<{ gameId: string }>();

  switch (gameId) {
    case 'pattern':
      return <PatternBuilder />;
    case 'bugSquash':
      return <BugSquash />;
    case 'logicPath':
      return <LogicPath />;
    case 'brainRot':
      return <BrainRot />;
    default:
      return <Navigate to="/play" replace />;
  }
};

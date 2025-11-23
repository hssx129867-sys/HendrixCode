import { useParams, Navigate } from 'react-router-dom';
import { PatternBuilder } from '../games/PatternBuilder';
import { BugSquash } from '../games/BugSquash';
import { LogicPath } from '../games/LogicPath';
import { BrainRot } from '../games/BrainRot';
import { PetVet } from '../games/PetVet';
import { NeighborGame } from '../games/NeighborGame';
import { DonkeyKong } from '../games/DonkeyKong';

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
    case 'petVet':
      return <PetVet />;
    case 'neighborGame':
      return <NeighborGame />;
    case 'donkeyKong':
      return <DonkeyKong />;
    default:
      return <Navigate to="/play" replace />;
  }
};

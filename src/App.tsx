import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Players } from './pages/Players';
import { Play } from './pages/Play';
import { Game } from './pages/Game';
import { Profile } from './pages/Profile';
import { ChristmasLab } from './pages/ChristmasLab';
import { ChristmasList } from './pages/ChristmasList';
import { SantaTracker } from './pages/SantaTracker';
import { ChristmasJokes } from './pages/ChristmasJokes';
import { ChristmasIdeas } from './pages/ChristmasIdeas';
import { FindElves } from './pages/FindElves';
import { SecretSanta } from './pages/SecretSanta';
import { ARGame } from './pages/ARGame';
import { ARDemo } from './pages/ARDemo';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/play" element={<Play />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ar-game" element={<ARGame />} />
        <Route path="/ar-demo" element={<ARDemo />} />
        <Route path="/christmas-lab" element={<ChristmasLab />} />
        <Route path="/christmas-list" element={<ChristmasList />} />
        <Route path="/santa-tracker" element={<SantaTracker />} />
        <Route path="/christmas-jokes" element={<ChristmasJokes />} />
        <Route path="/christmas-ideas" element={<ChristmasIdeas />} />
        <Route path="/find-elves" element={<FindElves />} />
        <Route path="/secret-santa" element={<SecretSanta />} />
      </Routes>
    </Router>
  );
}

export default App;

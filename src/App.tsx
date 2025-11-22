import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Players } from './pages/Players';
import { Play } from './pages/Play';
import { Game } from './pages/Game';
import { Profile } from './pages/Profile';
import { ChristmasLab } from './pages/ChristmasLab';
import { ChristmasList } from './pages/ChristmasList';
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
        <Route path="/christmas-lab" element={<ChristmasLab />} />
        <Route path="/christmas-list" element={<ChristmasList />} />
      </Routes>
    </Router>
  );
}

export default App;

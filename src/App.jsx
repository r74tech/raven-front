import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import EmbedSearchPage from './components/EmbedSearchPage';

export default function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/embed/search" element={<EmbedSearchPage />} />
        </Routes>
    </Router>
  );
}

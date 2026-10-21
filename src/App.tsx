import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Artwork from './pages/Artwork';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artwork/:id" element={<Artwork />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import MyFav from './pages/MyFav';
import Artwork from './pages/Artwork';
import Nav from './components/Nav';

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myfav" element={<MyFav />} />
        <Route path="/artwork/:id" element={<Artwork />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

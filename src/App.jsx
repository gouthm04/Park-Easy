import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddSpace from './pages/AddSpace';
import HostListings from './pages/HostListings';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/host/spaces/add" element={<AddSpace />} />
          <Route path="/host/listings" element={<HostListings />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
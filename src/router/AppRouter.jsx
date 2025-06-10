import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Services from '../pages/Services';
import Barbers from '../pages/Barbers';

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/barberos" element={<Barbers />} />
      </Routes>
    </HashRouter>
  );
}

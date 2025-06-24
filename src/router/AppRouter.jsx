import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Landing from '../pages/Landing';
import Services from '../pages/Services';
import Barbers from '../pages/Barbers';
import AdminDashboard from '../pages/AdminDashboard';
import Agendar from '../pages/Agendar';
import BarberDashboard from '../pages/BarberDashboard';

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/barberos" element={<Barbers />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/barbero" element={<BarberDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </HashRouter>
  );
}

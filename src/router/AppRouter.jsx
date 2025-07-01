import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Landing from '../pages/Landing';
import Services from '../pages/Services';
import Barbers from '../pages/Barbers';
import PublicServices from '../pages/PublicServices';
import BarbersPublic from '../pages/BarbersPublic';
import BarberProfile from '../pages/BarberProfile';
import AdminDashboard from '../pages/AdminDashboard';
import Agendar from '../pages/Agendar';
import BarberDashboard from '../pages/BarberDashboard';

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Home />} />
        <Route path="/servicios" element={<PublicServices />} />
        <Route path="/barberos" element={<BarbersPublic />} />
        <Route path="/barberos/:id" element={<BarberProfile />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/barbero" element={<BarberDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/servicios" element={<Services />} />
        <Route path="/admin/barberos" element={<Barbers />} />
      </Routes>
    </HashRouter>
  );
}

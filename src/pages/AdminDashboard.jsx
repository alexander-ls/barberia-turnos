import { useState } from 'react';
import TurnoForm from '../components/TurnoForm';
import AllTurnosList from '../components/AllTurnosList';
import BarberTurnos from '../components/BarberTurnos';
import AllBarberSchedules from '../components/AllBarberSchedules';
import UserMenu from '../components/UserMenu';
import Sidebar from '../components/Sidebar';
import {
  CalendarIcon,
  ListIcon,
  UsersIcon,
  ClockIcon,
  ClipboardIcon,
} from '../icons';

export default function AdminDashboard() {
  const [section, setSection] = useState('nuevo');

  const sections = [
    {
      label: 'Turnos',
      items: [
        { id: 'nuevo', label: 'Nuevo turno', icon: CalendarIcon },
        { id: 'recientes', label: 'Turnos recientes', icon: ListIcon },
        { id: 'porBarbero', label: 'Turnos por barbero', icon: UsersIcon },
        { id: 'horarios', label: 'Horarios cargados', icon: ClockIcon },
      ],
    },
    {
      label: 'Gestionar',
      items: [
        { id: 'servicios', label: 'Servicios', href: '#/admin/servicios', icon: ClipboardIcon },
        { id: 'barberos', label: 'Barberos', href: '#/admin/barberos', icon: UsersIcon },
      ],
    },
  ];

  const handleSelect = id => {
    if (id === 'servicios' || id === 'barberos') {
      window.location.hash = `/admin/${id}`;
    } else {
      setSection(id);
    }
  };

  return (
    <div className="flex">
      <Sidebar sections={sections} current={section} onSelect={handleSelect} />
      <div className="p-4 space-y-6 flex-1">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Panel de Administración</h2>
          <UserMenu />
        </div>

        {section === 'nuevo' && (
          <div className="card bg-base-100 shadow border border-base-300 w-full max-w-md mx-auto">
            <div className="card-body">
              <h3 className="card-title">Nuevo turno</h3>
              <TurnoForm />
            </div>
          </div>
        )}

        {section === 'recientes' && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body">
              <h3 className="card-title">Turnos recientes</h3>
              <AllTurnosList />
            </div>
          </div>
        )}

        {section === 'porBarbero' && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body">
              <h3 className="card-title">Turnos por barbero</h3>
              <BarberTurnos />
            </div>
          </div>
        )}

        {section === 'horarios' && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body">
              <h3 className="card-title">Horarios cargados</h3>
              <AllBarberSchedules />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

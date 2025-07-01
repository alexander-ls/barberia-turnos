import { useState } from 'react';
import TurnoForm from '../components/TurnoForm';
import AllTurnosList from '../components/AllTurnosList';
import BarberTurnos from '../components/BarberTurnos';
import AllBarberSchedules from '../components/AllBarberSchedules';
import UserMenu from '../components/UserMenu';

export default function AdminDashboard() {
  const [section, setSection] = useState('nuevo');

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Panel de Administración</h2>
        <UserMenu />
      </div>

      <div className="space-x-2">
        <a href="#/admin/servicios" className="btn btn-sm btn-outline">Servicios</a>
        <a href="#/admin/barberos" className="btn btn-sm btn-outline">Barberos</a>
      </div>

      <div className="divider"></div>

      <ul className="menu menu-horizontal bg-base-200 rounded-box border border-base-300 shadow">
        <li>
          <a onClick={() => setSection('nuevo')} className={section === 'nuevo' ? 'active' : ''}>Nuevo turno</a>
        </li>
        <li>
          <a onClick={() => setSection('recientes')} className={section === 'recientes' ? 'active' : ''}>Turnos recientes</a>
        </li>
        <li>
          <a onClick={() => setSection('porBarbero')} className={section === 'porBarbero' ? 'active' : ''}>Turnos por barbero</a>
        </li>
        <li>
          <a onClick={() => setSection('horarios')} className={section === 'horarios' ? 'active' : ''}>Horarios cargados</a>
        </li>
      </ul>

      <div className="divider"></div>

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
  );
}

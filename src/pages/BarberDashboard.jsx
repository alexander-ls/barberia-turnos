import { useState } from 'react';
import BarberMisTurnos from '../components/BarberMisTurnos';
import BarberScheduleForm from '../components/BarberScheduleForm';
import BarberScheduleList from '../components/BarberScheduleList';
import UserMenu from '../components/UserMenu';

export default function BarberDashboard() {
  const [section, setSection] = useState('cargar');

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Panel del Barbero</h2>
        <UserMenu />
      </div>

      <ul className="menu menu-horizontal bg-base-200 rounded-box">
        <li>
          <a
            onClick={() => setSection('cargar')}
            className={section === 'cargar' ? 'active' : ''}
          >
            Cargar horario
          </a>
        </li>
        <li>
          <a
            onClick={() => setSection('cargados')}
            className={section === 'cargados' ? 'active' : ''}
          >
            Horarios cargados
          </a>
        </li>
        <li>
          <a
            onClick={() => setSection('turnos')}
            className={section === 'turnos' ? 'active' : ''}
          >
            Turnos asignados
          </a>
        </li>
      </ul>

      {section === 'cargar' && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Cargar horarios disponibles</h3>
            <BarberScheduleForm />
          </div>
        </div>
      )}

      {section === 'cargados' && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Horarios cargados</h3>
            <BarberScheduleList />
          </div>
        </div>
      )}

      {section === 'turnos' && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Mis turnos asignados</h3>
            <BarberMisTurnos />
          </div>
        </div>
      )}
    </div>
  );
}

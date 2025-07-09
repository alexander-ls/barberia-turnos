import { useState } from 'react';
import BarberMisTurnos from '../components/BarberMisTurnos';
import BarberScheduleForm from '../components/BarberScheduleForm';
import BarberScheduleList from '../components/BarberScheduleList';
import UserMenu from '../components/UserMenu';
import Sidebar from '../components/Sidebar';
import { CalendarIcon, ClockIcon, ListIcon } from '../icons';

export default function BarberDashboard() {
  const [section, setSection] = useState('cargar');

  const sections = [
    {
      label: 'Horarios',
      items: [
        { id: 'cargar', label: 'Cargar horario', icon: CalendarIcon },
        { id: 'cargados', label: 'Horarios cargados', icon: ClockIcon },
      ],
    },
    {
      label: 'Turnos',
      items: [
        { id: 'turnos', label: 'Turnos asignados', icon: ListIcon },
      ],
    },
  ];

  const handleSelect = id => setSection(id);

  return (
    <div className="flex">
      <Sidebar sections={sections} current={section} onSelect={handleSelect} />
      <div className="p-4 space-y-6 flex-1">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Panel del Barbero</h2>
          <UserMenu />
        </div>


      {section === 'cargar' && (
        <div className="card bg-base-100 shadow border border-base-300 w-full max-w-md mx-auto">
          <div className="card-body">
            <h3 className="card-title">Cargar horarios disponibles</h3>
            <BarberScheduleForm />
          </div>
        </div>
      )}

      {section === 'cargados' && (
        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h3 className="card-title">Horarios cargados</h3>
            <BarberScheduleList />
          </div>
        </div>
      )}

      {section === 'turnos' && (
        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h3 className="card-title">Mis turnos asignados</h3>
            <BarberMisTurnos />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import TurnoForm from '../components/TurnoForm';
import AllTurnosList from '../components/AllTurnosList';
import BarberTurnos from '../components/BarberTurnos';
import AdminScheduleCalendar from '../components/AdminScheduleCalendar';
import AdminLayout from '../layouts/AdminLayout';
import { adminSections } from '../constants/adminSections';

export default function AdminDashboard() {
  const [section, setSection] = useState('nuevo');

  const sections = adminSections;

  const handleSelect = id => {
    if (id === 'servicios' || id === 'barberos') {
      window.location.hash = `/admin/${id}`;
    } else {
      setSection(id);
    }
  };

  return (
    <AdminLayout sections={sections} current={section} onSelect={handleSelect}>

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
              <AdminScheduleCalendar />
            </div>
          </div>
        )}
    </AdminLayout>
  );
}

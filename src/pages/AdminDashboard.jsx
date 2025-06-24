import TurnoForm from '../components/TurnoForm';
import AllTurnosList from '../components/AllTurnosList';
import BarberTurnos from '../components/BarberTurnos';
import AllBarberSchedules from '../components/AllBarberSchedules';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Super Admin - Turnos</h2>
      <a
        href="#/servicios"
        className="text-blue-600 hover:underline block mb-4"
      >
        Gestionar servicios
      </a>
      <a
        href="#/barberos"
        className="text-blue-600 hover:underline block mb-4"
      >
        Gestionar barberos
      </a>
      <div className="grid gap-6 md:grid-cols-2">
        <TurnoForm />
        <AllTurnosList />
      </div>
      <h2 className="text-xl font-semibold mb-4 mt-8">Turnos por barbero</h2>
      <BarberTurnos />
      <h2 className="text-xl font-semibold mb-4 mt-8">Horarios cargados</h2>
      <AllBarberSchedules />
    </div>
  );
}

import TurnoForm from '../components/TurnoForm';
import AllTurnosList from '../components/AllTurnosList';
import BarberTurnos from '../components/BarberTurnos';
import AllBarberSchedules from '../components/AllBarberSchedules';
import UserMenu from '../components/UserMenu';

export default function AdminDashboard() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Panel de Administración</h2>
        <UserMenu />
      </div>

      <div className="space-x-2">
        <a href="#/servicios" className="btn btn-sm btn-outline">Servicios</a>
        <a href="#/barberos" className="btn btn-sm btn-outline">Barberos</a>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Nuevo turno</h3>
            <TurnoForm />
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Turnos recientes</h3>
            <AllTurnosList />
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Turnos por barbero</h3>
            <BarberTurnos />
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Horarios cargados</h3>
            <AllBarberSchedules />
          </div>
        </div>
      </div>
    </div>
  );
}

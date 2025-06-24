import BarberMisTurnos from '../components/BarberMisTurnos';
import BarberScheduleForm from '../components/BarberScheduleForm';
import BarberScheduleList from '../components/BarberScheduleList';
import UserMenu from '../components/UserMenu';

export default function BarberDashboard() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Panel del Barbero</h2>
        <UserMenu />
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Cargar horarios disponibles</h3>
          <BarberScheduleForm />
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Horarios cargados</h3>
          <BarberScheduleList />
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Mis turnos asignados</h3>
          <BarberMisTurnos />
        </div>
      </div>
    </div>
  );
}

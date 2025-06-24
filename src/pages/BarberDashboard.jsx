import BarberMisTurnos from '../components/BarberMisTurnos';
import BarberScheduleForm from '../components/BarberScheduleForm';

export default function BarberDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Cargar horarios disponibles</h2>
      <BarberScheduleForm />
      <h2 className="text-xl font-semibold mb-4 mt-8">Mis turnos asignados</h2>
      <BarberMisTurnos />
    </div>
  );
}

import BarberMisTurnos from '../components/BarberMisTurnos';
import BarberHorarioForm from '../components/BarberHorarioForm';
import BarberHorarioList from '../components/BarberHorarioList';

export default function BarberDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Mis turnos asignados</h2>
      <BarberMisTurnos />
      <h2 className="text-xl font-semibold my-4">Mis horarios de trabajo</h2>
      <BarberHorarioForm />
      <BarberHorarioList />
    </div>
  );
}

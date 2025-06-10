import BarberMisTurnos from '../components/BarberMisTurnos';

export default function BarberDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Mis turnos asignados</h2>
      <BarberMisTurnos />
    </div>
  );
}

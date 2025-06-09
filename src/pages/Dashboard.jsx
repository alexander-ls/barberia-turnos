import TurnoForm from '../components/TurnoForm';
import TurnosList from '../components/TurnosList';

export default function Dashboard() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Dashboard de Turnos</h2>
      <TurnoForm />
      <TurnosList />
    </div>
  );
}
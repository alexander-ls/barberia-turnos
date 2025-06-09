import TurnoForm from '../components/TurnoForm';
import TurnosList from '../components/TurnosList';

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard de Turnos</h2>
      <TurnoForm />
      <TurnosList />
    </div>
  );
}
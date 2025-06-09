import TurnoForm from '../components/TurnoForm';
import TurnosList from '../components/TurnosList';

export default function Dashboard() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Dashboard de Turnos</h2>
      <a
        href="#/servicios"
        className="text-blue-600 hover:underline block mb-4"
      >
        Gestionar servicios
      </a>
      <TurnoForm />
      <TurnosList />
    </div>
  );
}
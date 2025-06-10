import TurnoForm from '../components/TurnoForm';
import TurnosList from '../components/TurnosList';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Dashboard de Turnos</h2>
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
        <TurnosList />
      </div>
    </div>
  );
}
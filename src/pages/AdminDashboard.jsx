import TurnoForm from '../components/TurnoForm';
import AllTurnosList from '../components/AllTurnosList';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Super Admin - Turnos</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <TurnoForm />
        <AllTurnosList />
      </div>
    </div>
  );
}

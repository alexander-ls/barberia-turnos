import BarberForm from '../components/BarberForm';
import BarberList from '../components/BarberList';

export default function Barbers() {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">Gestionar Barberos</h2>

      <div className="card bg-base-100 shadow border border-base-300 w-full max-w-md mx-auto">
        <div className="card-body">
          <h3 className="card-title">Nuevo barbero</h3>
          <BarberForm />
        </div>
      </div>

      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body">
          <h3 className="card-title">Barberos existentes</h3>
          <BarberList />
        </div>
      </div>
    </div>
  );
}

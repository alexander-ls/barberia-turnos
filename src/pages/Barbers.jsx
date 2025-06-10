import BarberForm from '../components/BarberForm';
import BarberList from '../components/BarberList';
import BarberTurnos from '../components/BarberTurnos';

export default function Barbers() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Gestionar Barberos</h2>
      <BarberForm />
      <BarberList />
      <h2 className="text-xl font-semibold mb-4 mt-8">Turnos por Barbero</h2>
      <BarberTurnos />
    </div>
  );
}

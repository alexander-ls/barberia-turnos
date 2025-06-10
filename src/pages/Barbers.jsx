import BarberForm from '../components/BarberForm';
import BarberList from '../components/BarberList';

export default function Barbers() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Gestionar Barberos</h2>
      <BarberForm />
      <BarberList />
    </div>
  );
}

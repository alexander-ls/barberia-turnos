import ServiceForm from '../components/ServiceForm';
import ServiceList from '../components/ServiceList';

export default function Services() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Gestionar Servicios</h2>
      <ServiceForm />
      <ServiceList />
    </div>
  );
}

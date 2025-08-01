import ServiceForm from '../components/ServiceForm';
import ServiceList from '../components/ServiceList';
import AdminLayout from '../layouts/AdminLayout';
import { adminSections } from '../constants/adminSections';

export default function Services() {
  const sections = adminSections;
  const handleSelect = id => {
    if (id === 'servicios' || id === 'barberos') {
      window.location.hash = `/admin/${id}`;
    } else {
      window.location.hash = '/admin';
    }
  };
  return (
    <AdminLayout sections={sections} current="servicios" onSelect={handleSelect}>
      <h2 className="text-xl font-semibold">Gestionar Servicios</h2>

      <div className="card bg-base-100 shadow border border-base-300 w-full max-w-md mx-auto">
        <div className="card-body">
          <h3 className="card-title">Nuevo servicio</h3>
          <ServiceForm />
        </div>
      </div>

      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body">
          <h3 className="card-title">Servicios existentes</h3>
          <ServiceList />
        </div>
      </div>
    </AdminLayout>
  );
}

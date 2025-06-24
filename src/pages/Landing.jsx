import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../auth/FirebaseConfig';
import hero from '../assets/barber.svg';

export default function Landing() {
  const [servicios, setServicios] = useState([]);
  const [barberos, setBarberos] = useState([]);

  useEffect(() => {
    const unsubServ = onSnapshot(collection(db, 'servicios'), snap => {
      setServicios(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubBarb = onSnapshot(collection(db, 'barberos'), snap => {
      setBarberos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      unsubServ();
      unsubBarb();
    };
  }, []);

  return (
    <div>
      <header className="p-4 flex justify-end bg-base-200">
        <a href="#/login" className="btn btn-outline">Iniciar sesión</a>
      </header>
      <section
        className="relative hero min-h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="relative hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-4 text-5xl font-bold">Barbería</h1>
            <p className="mb-4">
              Los mejores estilos y cortes profesionales para ti.
            </p>
            <a href="#/agendar" className="btn btn-primary">Agendar Turno</a>
          </div>
        </div>
      </section>
      <section className="p-4">
        <h2 className="text-3xl font-bold text-center mb-6">Servicios</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servicios.map(s => (
            <div key={s.id} className="p-4 border rounded shadow">
              <h3 className="font-semibold">{s.nombre}</h3>
              {s.precio && (
                <p className="text-gray-600">${s.precio}</p>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="p-4 bg-base-200">
        <h2 className="text-3xl font-bold text-center mb-6">Nuestros Barberos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {barberos.map(b => (
            <div key={b.id} className="p-4 border rounded shadow">
              <h3 className="font-semibold">{b.nombre}</h3>
              {b.email && <p className="text-gray-600">{b.email}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../auth/FirebaseConfig';
import hero from '../assets/barber.svg';
import { Link } from 'react-router-dom';

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
      <header className="navbar bg-base-200 justify-between px-4">
        <Link to="/" className="btn btn-ghost text-xl">Barbería</Link>
        <nav className="space-x-2">
          <Link to="/servicios" className="btn btn-ghost btn-sm">Servicios</Link>
          <Link to="/barberos" className="btn btn-ghost btn-sm">Barberos</Link>
          <a href="#/login" className="btn btn-outline btn-sm">Iniciar sesión</a>
        </nav>
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
      <section id="servicios" className="py-16 px-6 max-w-6xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-center">Nuestros Servicios</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {servicios.slice(0,4).map(s => (
            <div key={s.id} className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">{s.nombre}</h3>
                {s.precio && <p className="text-lg">${s.precio}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/servicios" className="btn btn-primary">Ver todos</Link>
        </div>
      </section>


      <section className="bg-gray-100 py-16 px-6 space-y-6">
        <h2 className="text-3xl font-bold text-center">Conoce a Nuestros Barberos</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
          {barberos.slice(0,3).map(b => (
            <Link key={b.id} to={`/barberos/${b.id}`} className="card bg-base-200">
              <div className="card-body items-center text-center">
                <div className="avatar">
                  <div className="w-24 rounded-full">
                    <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                  </div>
                </div>
                <h3 className="card-title">{b.nombre}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link to="/barberos" className="btn btn-primary">Ver todos</Link>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../auth/FirebaseConfig';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function BarbersPublic() {
  const [barberos, setBarberos] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'barberos'), snap => {
      setBarberos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  return (
    <div>
      <Navbar />
      <div className="pt-16 space-y-6">
        <section className="hero min-h-[40vh] bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md space-y-4">
              <h1 className="text-4xl font-bold">Nuestro Equipo</h1>
              <p className="opacity-80">Profesionales listos para darte el mejor estilo.</p>
              <Link to="/agendar" className="btn btn-primary">
                Agendar Turno
              </Link>
            </div>
          </div>
        </section>

        <div className="p-6 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Barberos</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {barberos.map(b => (
              <Link
                key={b.id}
                to={`/barberos/${b.id}`}
                className="card bg-base-200 rounded-lg shadow transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="card-body items-center text-center space-y-2">
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src={b.imagen || 'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp'} />
                    </div>
                  </div>
                  <h3 className="card-title">{b.nombre}</h3>
                  {b.telefono && <p className="text-sm opacity-80">{b.telefono}</p>}
                  {b.email && <p className="text-sm opacity-80">{b.email}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../auth/FirebaseConfig';

export default function PublicServices() {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'servicios'), snap => {
      setServicios(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Servicios</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicios.map(s => (
          <div
            key={s.id}
            className="card bg-base-200 shadow hover:shadow-lg transition"
          >
            <figure className="px-4 pt-4">
              <img
                className="w-24 h-24 object-contain"
                src="https://cdn-icons-png.flaticon.com/512/7338/7338646.png"
                alt="Icono servicio"
              />
            </figure>
            <div className="card-body items-center text-center space-y-2">
              <h2 className="card-title">{s.nombre}</h2>
              {s.precio && <p className="opacity-70">${s.precio}</p>}
              {s.descripcion && (
                <p className="text-sm opacity-80">{s.descripcion}</p>
              )}
              <div className="card-actions mt-2">
                <Link
                  to={`/agendar?servicio=${encodeURIComponent(s.nombre)}`}
                  className="btn btn-primary btn-sm"
                >
                  Reservar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

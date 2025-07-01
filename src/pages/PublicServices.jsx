import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Servicios</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {servicios.map(s => (
          <div key={s.id} className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">{s.nombre}</h2>
              {s.precio && <p className="text-lg">${s.precio}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

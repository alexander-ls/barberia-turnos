import { useEffect, useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function BarberList() {
  const [barberos, setBarberos] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'barberos'), (snapshot) => {
      setBarberos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const eliminarBarbero = async (id) => {
    await deleteDoc(doc(db, 'barberos', id));
  };

  return (
    <div className="grid gap-4">
      {barberos.map((barbero) => (
        <div key={barbero.id} className="card bg-base-100 shadow-md p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{barbero.nombre}</p>
              {barbero.email && <p>{barbero.email}</p>}
              {barbero.telefono && <p>{barbero.telefono}</p>}
            </div>
            <button
              onClick={() => eliminarBarbero(barbero.id)}
              className="btn btn-xs btn-error"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

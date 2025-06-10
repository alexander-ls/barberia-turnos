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
    <ul className="space-y-2">
      {barberos.map((barbero) => (
        <li key={barbero.id} className="p-2 border rounded flex justify-between">
          <span>
            {barbero.nombre}
            {barbero.email ? ` - ${barbero.email}` : ''}
          </span>
          <button
            onClick={() => eliminarBarbero(barbero.id)}
            className="text-red-600 hover:underline"
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}

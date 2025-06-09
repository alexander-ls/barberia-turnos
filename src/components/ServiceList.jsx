import { useEffect, useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function ServiceList() {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'servicios'), (snapshot) => {
      setServicios(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const eliminarServicio = async (id) => {
    await deleteDoc(doc(db, 'servicios', id));
  };

  return (
    <ul className="space-y-2">
      {servicios.map((servicio) => (
        <li key={servicio.id} className="p-2 border rounded flex justify-between">
          <span>{servicio.nombre}</span>
          <button
            onClick={() => eliminarServicio(servicio.id)}
            className="text-red-600 hover:underline"
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}

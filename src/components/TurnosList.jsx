import { useEffect, useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function TurnosList() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'turnos'), (snapshot) => {
      setTurnos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const eliminarTurno = async (id) => {
    await deleteDoc(doc(db, 'turnos', id));
  };

  return (
    <ul className="space-y-2">
      {turnos.map((turno) => (
        <li key={turno.id} className="flex items-center justify-between p-2 border rounded">
          <span>{turno.nombre}</span>
          <button
            onClick={() => eliminarTurno(turno.id)}
            className="text-red-600 hover:underline"
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}
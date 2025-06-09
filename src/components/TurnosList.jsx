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
        <li key={turno.id} className="p-2 border rounded">
          <div className="flex justify-between">
            <span className="font-semibold">{turno.nombre}</span>
            <button
              onClick={() => eliminarTurno(turno.id)}
              className="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </div>
          <p className="text-sm text-gray-700">Fecha: {turno.fecha}</p>
          <p className="text-sm text-gray-700">Hora: {turno.hora}</p>
          <p className="text-sm text-gray-700">Servicio: {turno.servicio}</p>
          <p className="text-sm text-gray-700">Barbero: {turno.barbero}</p>
        </li>
      ))}
    </ul>
  );
}

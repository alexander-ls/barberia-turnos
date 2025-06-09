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
        <li key={turno.id} className="p-4 bg-base-200 rounded">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{turno.nombre}</span>
            <button
              onClick={() => eliminarTurno(turno.id)}
              className="btn btn-sm btn-outline btn-error"
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

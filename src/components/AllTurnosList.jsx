import { useEffect, useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { formatHoraBogota } from '../utils/time';

export default function AllTurnosList() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'turnos'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setTurnos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const eliminarTurno = async id => {
    await deleteDoc(doc(db, 'turnos', id));
  };

  return (
    <div className="grid gap-4">
      {turnos.map(turno => (
        <div key={turno.id} className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <h2 className="card-title">{turno.nombre}</h2>
              <button onClick={() => eliminarTurno(turno.id)} className="btn btn-sm btn-error">
                Eliminar
              </button>
            </div>
            <p>Fecha: {turno.fecha}</p>
            <p>Hora: {formatHoraBogota(turno.hora)}</p>
            <p>Servicio: {turno.servicio}</p>
            <p>Barbero: {turno.barbero}</p>
            {turno.email && <p>Email: {turno.email}</p>}
            {turno.telefono && <p>Teléfono: {turno.telefono}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

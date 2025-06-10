import { useEffect, useState } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function TurnosList() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    let unsubscribeTurnos;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(collection(db, 'turnos'), where('userId', '==', user.uid));
        unsubscribeTurnos = onSnapshot(q, (snapshot) => {
          setTurnos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
      } else {
        setTurnos([]);
        if (unsubscribeTurnos) unsubscribeTurnos();
      }
    });

    return () => {
      if (unsubscribeTurnos) unsubscribeTurnos();
      unsubscribeAuth();
    };
  }, []);

  const eliminarTurno = async (id) => {
    await deleteDoc(doc(db, 'turnos', id));
  };

  return (
    <div className="grid gap-4">
      {turnos.map((turno) => (
        <div key={turno.id} className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <h2 className="card-title">{turno.nombre}</h2>
              <button
                onClick={() => eliminarTurno(turno.id)}
                className="btn btn-sm btn-error"
              >
                Eliminar
              </button>
            </div>
            <p>Fecha: {turno.fecha}</p>
            <p>Hora: {turno.hora}</p>
            <p>Servicio: {turno.servicio}</p>
            <p>Barbero: {turno.barbero}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

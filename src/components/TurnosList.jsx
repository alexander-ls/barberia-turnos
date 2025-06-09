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
    <ul>
      {turnos.map((turno) => (
        <li key={turno.id}>
          {turno.nombre} - <button onClick={() => eliminarTurno(turno.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
}
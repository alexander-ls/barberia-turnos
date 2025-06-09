import { useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function TurnoForm() {
  const [nombre, setNombre] = useState('');

  const guardarTurno = async () => {
    if (!nombre) return;
    await addDoc(collection(db, 'turnos'), {
      nombre,
      timestamp: new Date()
    });
    setNombre('');
  };

  return (
    <div>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del cliente" />
      <button onClick={guardarTurno}>Guardar turno</button>
    </div>
  );
}

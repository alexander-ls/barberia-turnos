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
    <div className="flex items-center space-x-2 mb-4">
      <input
        className="border p-2 rounded flex-grow"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del cliente"
      />
      <button
        onClick={guardarTurno}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Guardar turno
      </button>
    </div>
  );
}

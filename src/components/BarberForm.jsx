import { useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function BarberForm() {
  const [nombre, setNombre] = useState('');

  const guardarBarbero = async () => {
    if (!nombre) return;
    await addDoc(collection(db, 'barberos'), {
      nombre,
      timestamp: new Date(),
    });
    setNombre('');
  };

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <input
        className="border p-2 rounded"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del barbero"
      />
      <button
        onClick={guardarBarbero}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Guardar barbero
      </button>
    </div>
  );
}

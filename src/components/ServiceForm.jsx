import { useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function ServiceForm() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const guardarServicio = async () => {
    if (!nombre || !precio) return;
    await addDoc(collection(db, 'servicios'), {
      nombre,
      precio: parseFloat(precio),
      descripcion,
      timestamp: new Date(),
    });
    setNombre('');
    setPrecio('');
    setDescripcion('');
  };

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <input
        className="border p-2 rounded"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del servicio"
      />
      <input
        className="border p-2 rounded"
        type="number"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        placeholder="Precio"
      />
      <textarea
        className="border p-2 rounded"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
      />
      <button
        onClick={guardarServicio}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Guardar servicio
      </button>
    </div>
  );
}

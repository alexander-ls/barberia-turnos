import { useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function TurnoForm() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [servicio, setServicio] = useState('');
  const [barbero, setBarbero] = useState('');

  const guardarTurno = async () => {
    if (!nombre || !fecha || !servicio || !barbero) return;
    await addDoc(collection(db, 'turnos'), {
      nombre,
      fecha,
      servicio,
      barbero,
      timestamp: new Date(),
    });
    setNombre('');
    setFecha('');
    setServicio('');
    setBarbero('');
  };

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <input
        className="border p-2 rounded"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del cliente"
      />
      <input
        type="date"
        className="border p-2 rounded"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      <input
        className="border p-2 rounded"
        value={servicio}
        onChange={(e) => setServicio(e.target.value)}
        placeholder="Servicio"
      />
      <input
        className="border p-2 rounded"
        value={barbero}
        onChange={(e) => setBarbero(e.target.value)}
        placeholder="Nombre del barbero"
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

import { useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function TurnoForm() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [servicio, setServicio] = useState('');
  const [barbero, setBarbero] = useState('');

  const guardarTurno = async () => {
    if (!nombre || !fecha || !hora || !servicio || !barbero) return;
    await addDoc(collection(db, 'turnos'), {
      nombre,
      fecha,
      hora,
      servicio,
      barbero,
      timestamp: new Date(),
    });
    setNombre('');
    setFecha('');
    setHora('');
    setServicio('');
    setBarbero('');
  };

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <input
        className="input input-bordered"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del cliente"
      />
      <input
        type="date"
        className="input input-bordered"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      <input
        type="time"
        className="input input-bordered"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
      />
      <input
        className="input input-bordered"
        value={servicio}
        onChange={(e) => setServicio(e.target.value)}
        placeholder="Servicio"
      />
      <input
        className="input input-bordered"
        value={barbero}
        onChange={(e) => setBarbero(e.target.value)}
        placeholder="Nombre del barbero"
      />
      <button
        onClick={guardarTurno}
        className="btn btn-success"
      >
        Guardar turno
      </button>
    </div>
  );
}

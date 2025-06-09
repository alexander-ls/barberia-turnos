import { useState, useEffect } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

export default function TurnoForm() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [servicio, setServicio] = useState('');
  const [barbero, setBarbero] = useState('');
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'servicios'), (snapshot) => {
      setServicios(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

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
        type="time"
        className="border p-2 rounded"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
      />
      <select
        className="border p-2 rounded"
        value={servicio}
        onChange={(e) => setServicio(e.target.value)}
      >
        <option value="">Seleccione un servicio</option>
        {servicios.map((s) => (
          <option key={s.id} value={s.nombre}>
            {s.nombre}
          </option>
        ))}
      </select>
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

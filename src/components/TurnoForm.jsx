import { useState, useEffect } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

export default function TurnoForm() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [servicio, setServicio] = useState('');
  const [barbero, setBarbero] = useState('');
  const [servicios, setServicios] = useState([]);
  const [barberos, setBarberos] = useState([]);

  useEffect(() => {
    const unsubServicios = onSnapshot(collection(db, 'servicios'), (snapshot) => {
      setServicios(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    const unsubBarberos = onSnapshot(collection(db, 'barberos'), (snapshot) => {
      setBarberos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      unsubServicios();
      unsubBarberos();
    };
  }, []);

  const guardarTurno = async () => {
    if (!nombre || !fecha || !hora || !servicio || !barbero) return;
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    await addDoc(collection(db, 'turnos'), {
      nombre,
      fecha,
      hora,
      servicio,
      barbero,
      userId,
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
      <select
        className="border p-2 rounded"
        value={barbero}
        onChange={(e) => setBarbero(e.target.value)}
      >
        <option value="">Seleccione un barbero</option>
        {barberos.map((b) => (
          <option key={b.id} value={b.nombre}>
            {b.nombre}
          </option>
        ))}
      </select>
      <button
        onClick={guardarTurno}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Guardar turno
      </button>
    </div>
  );
}

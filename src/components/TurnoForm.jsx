import { useState, useEffect } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';

export default function TurnoForm() {
  const [servicio, setServicio] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [nombre, setNombre] = useState('');
  const [barbero, setBarbero] = useState('');
  const [servicios, setServicios] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [barberosDisponibles, setBarberosDisponibles] = useState([]);

  useEffect(() => {
    const unsubServicios = onSnapshot(collection(db, 'servicios'), snap => {
      setServicios(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubServicios();
  }, []);

  useEffect(() => {
    if (servicio && fecha) {
      const q = query(
        collection(db, 'disponibilidades'),
        where('servicio', '==', servicio),
        where('fecha', '==', fecha)
      );
      const unsub = onSnapshot(q, snap => {
        const horas = [...new Set(snap.docs.map(d => d.data().hora))];
        setHorasDisponibles(horas);
      });
      return () => unsub();
    } else {
      setHorasDisponibles([]);
    }
  }, [servicio, fecha]);

  useEffect(() => {
    if (servicio && fecha && hora) {
      const q = query(
        collection(db, 'disponibilidades'),
        where('servicio', '==', servicio),
        where('fecha', '==', fecha),
        where('hora', '==', hora)
      );
      const unsub = onSnapshot(q, snap => {
        const barbs = [...new Set(snap.docs.map(d => d.data().barbero))];
        setBarberosDisponibles(barbs);
      });
      return () => unsub();
    } else {
      setBarberosDisponibles([]);
    }
  }, [servicio, fecha, hora]);

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
      <select className="border p-2 rounded" value={servicio} onChange={e => setServicio(e.target.value)}>
        <option value="">Seleccione un servicio</option>
        {servicios.map(s => (
          <option key={s.id} value={s.nombre}>{s.nombre}</option>
        ))}
      </select>
      {servicio && (
        <input type="date" className="border p-2 rounded" value={fecha} onChange={e => setFecha(e.target.value)} />
      )}
      {horasDisponibles.length > 0 && (
        <select className="border p-2 rounded" value={hora} onChange={e => setHora(e.target.value)}>
          <option value="">Seleccione una hora</option>
          {horasDisponibles.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      )}
      {barberosDisponibles.length > 0 && (
        <select className="border p-2 rounded" value={barbero} onChange={e => setBarbero(e.target.value)}>
          <option value="">Seleccione un barbero</option>
          {barberosDisponibles.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      )}
      {barbero && (
        <input className="border p-2 rounded" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del cliente" />
      )}
      {barbero && (
        <button onClick={guardarTurno} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Guardar turno
        </button>
      )}
    </div>
  );
}

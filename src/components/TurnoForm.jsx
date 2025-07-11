import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { auth, db } from '../auth/FirebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { formatHoraBogota } from '../utils/time';

export default function TurnoForm({ showSteps = false }) {
  const [searchParams] = useSearchParams();
  const servicioQuery = searchParams.get('servicio') || '';
  const [servicio, setServicio] = useState(servicioQuery);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [barbero, setBarbero] = useState('');
  const [servicios, setServicios] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [barberosDisponibles, setBarberosDisponibles] = useState([]);
  const [slotsPorHora, setSlotsPorHora] = useState({});
  const [turnosPorHora, setTurnosPorHora] = useState({});
  const [barberosOcupados, setBarberosOcupados] = useState([]);
  const [exito, setExito] = useState(false);

  const currentStep = !servicio
    ? 1
    : !fecha
      ? 2
      : !hora
        ? 3
        : !barbero
          ? 4
          : 5;

  useEffect(() => {
    if (servicioQuery) setServicio(servicioQuery);
  }, [servicioQuery]);

  useEffect(() => {
    const unsubServicios = onSnapshot(collection(db, 'servicios'), snap => {
      setServicios(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubServicios();
  }, []);

  useEffect(() => {
    if (fecha) {
      const q = query(collection(db, 'turnos'), where('fecha', '==', fecha));
      const unsub = onSnapshot(q, snap => {
        const byHour = {};
        snap.forEach(d => {
          const { hora, barbero: b } = d.data();
          if (!byHour[hora]) byHour[hora] = [];
          byHour[hora].push(b);
        });
        setTurnosPorHora(byHour);
      });
      return () => unsub();
    }
    setTurnosPorHora({});
  }, [fecha]);

  useEffect(() => {
    if (servicio && fecha) {
      const q = query(
        collection(db, 'disponibilidades'),
        where('servicio', '==', servicio),
        where('fecha', '==', fecha)
      );
      const unsub = onSnapshot(q, snap => {
        const byHour = {};
        snap.forEach(d => {
          const { hora: h, barbero: b } = d.data();
          if (!byHour[h]) byHour[h] = [];
          byHour[h].push(b);
        });
        setSlotsPorHora(byHour);
      });
      return () => unsub();
    }
    setSlotsPorHora({});
  }, [servicio, fecha]);

  useEffect(() => {
    const horas = Object.keys(slotsPorHora);
    const disponibles = horas.filter(h => {
      const booked = turnosPorHora[h] || [];
      const libres = slotsPorHora[h].filter(b => !booked.includes(b));
      return libres.length > 0;
    });
    setHorasDisponibles(disponibles);
  }, [slotsPorHora, turnosPorHora]);

  useEffect(() => {
    if (fecha && hora) {
      const q = query(
        collection(db, 'turnos'),
        where('fecha', '==', fecha),
        where('hora', '==', hora)
      );
      const unsub = onSnapshot(q, snap => {
        setBarberosOcupados(snap.docs.map(d => d.data().barbero));
      });
      return () => unsub();
    } else {
      setBarberosOcupados([]);
    }
  }, [fecha, hora]);

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
        const disponibles = barbs.filter(b => !barberosOcupados.includes(b));
        setBarberosDisponibles(disponibles);
      });
      return () => unsub();
    } else {
      setBarberosDisponibles([]);
    }
  }, [servicio, fecha, hora, barberosOcupados]);

  const guardarTurno = async () => {
    if (!nombre || !fecha || !hora || !servicio || !barbero || !email || !telefono) return;
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    const turno = {
      nombre,
      fecha,
      hora,
      servicio,
      barbero,
      email,
      telefono,
      estado: 'pendiente',
      userId,
      timestamp: new Date(),
    };
    await addDoc(collection(db, 'turnos'), turno);
    try {
      await fetch(
        'https://hook.us2.make.com/307slkl4v8t4p76yy91sugd5uql87t6d',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(turno),
        }
      );
    } catch (err) {
      console.error('Error calling webhook', err);
    }
    setExito(true);
    setTimeout(() => setExito(false), 3000);
    setNombre('');
    setFecha('');
    setHora('');
    setServicio('');
    setBarbero('');
    setEmail('');
    setTelefono('');
  };

  return (
    <div className="flex flex-col space-y-2 mb-4">
      {showSteps && (
        <div data-theme="corporate"> 
        <ul className="steps w-full mb-4">
          <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>Servicio</li>
          <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>Fecha</li>
          <li className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>Hora</li>
          <li className={`step ${currentStep >= 4 ? 'step-primary' : ''}`}>Barbero</li>
          <li className={`step ${currentStep >= 5 ? 'step-primary' : ''}`}>Datos</li>
        </ul>
        </div>
      )}
      {servicio && fecha && horasDisponibles.length === 0 && (
        <div role="alert" className="alert alert-warning">
          <span>Sin turnos disponibles para ese día</span>
        </div>
      )}
   
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
            <option key={h} value={h}>{formatHoraBogota(h)}</option>
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
        <input className="border p-2 rounded" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo del cliente" />
      )}
      {barbero && (
        <input className="border p-2 rounded" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono del cliente" />
      )}
      {barbero && (
        <button onClick={guardarTurno} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Guardar turno
        </button>
      )}
      {exito && (
        <div role="alert" className="alert alert-success">
          <span>Turno guardado</span>
        </div>
      )}
    </div>
  );
}

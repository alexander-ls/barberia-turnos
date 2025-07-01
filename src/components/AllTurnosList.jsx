import { useEffect, useState, useMemo, useRef } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { formatHoraBogota } from '../utils/time';

export default function AllTurnosList() {
  const [turnos, setTurnos] = useState([]);
  const [activeDate, setActiveDate] = useState('');
  const [activeBarbero, setActiveBarbero] = useState('');
  const dateTabsRef = useRef(null);

  const scrollLeft = ref => {
    if (ref.current) {
      ref.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollRight = ref => {
    if (ref.current) {
      ref.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'turnos'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setTurnos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const dates = useMemo(
    () => Array.from(new Set(turnos.map(t => t.fecha))).sort(),
    [turnos]
  );

  useEffect(() => {
    if (dates.length > 0 && !dates.includes(activeDate)) {
      setActiveDate(dates[0]);
    }
  }, [dates, activeDate]);

  const barberos = useMemo(
    () =>
      Array.from(
        new Set(turnos.filter(t => t.fecha === activeDate).map(t => t.barbero))
      ),
    [turnos, activeDate]
  );

  useEffect(() => {
    if (barberos.length > 0 && !barberos.includes(activeBarbero)) {
      setActiveBarbero(barberos[0]);
    }
  }, [barberos, activeBarbero]);

  const eliminarTurno = async id => {
    await deleteDoc(doc(db, 'turnos', id));
  };

  if (turnos.length === 0) {
    return <p>No hay turnos registrados.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <button onClick={() => scrollLeft(dateTabsRef)} className="btn btn-square btn-sm mr-2">❮</button>
        <div
          ref={dateTabsRef}
          role="tablist"
          className="tabs tabs-boxed flex-1 overflow-x-auto whitespace-nowrap scroll-smooth"
        >
          {dates.map(d => (
            <button
              key={d}
              role="tab"
              className={`tab ${activeDate === d ? 'tab-active' : ''}`}
              onClick={() => setActiveDate(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <button onClick={() => scrollRight(dateTabsRef)} className="btn btn-square btn-sm ml-2">❯</button>
      </div>

      <div className="flex justify-center">
        <div role="tablist" className="tabs tabs-boxed overflow-x-auto">
          {barberos.map(b => (
            <button
              key={b}
              role="tab"
              className={`tab ${activeBarbero === b ? 'tab-active' : ''}`}
              onClick={() => setActiveBarbero(b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {turnos
          .filter(t => t.fecha === activeDate)
          .filter(t => t.barbero === activeBarbero)
          .map(turno => (
            <div key={turno.id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">{turno.nombre}</h2>
                  <span
                    className={`badge ${
                      (turno.estado || 'pendiente') === 'pendiente'
                        ? 'badge-info'
                        : (turno.estado || 'pendiente') === 'atendido'
                        ? 'badge-success'
                        : 'badge-error'
                    }`}
                  >
                    {turno.estado || 'pendiente'}
                  </span>
                </div>
                <p>Fecha: {turno.fecha}</p>
                <p>Hora: {formatHoraBogota(turno.hora)}</p>
                <p>Servicio: {turno.servicio}</p>
                <p>Barbero: {turno.barbero}</p>
                {turno.email && <p>Correo: {turno.email}</p>}
                {turno.telefono && <p>Teléfono: {turno.telefono}</p>}
                <div className="pt-2">
                  <button
                    onClick={() => eliminarTurno(turno.id)}
                    className="btn btn-xs btn-error"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

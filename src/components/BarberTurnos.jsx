import { useEffect, useState, useMemo, useRef } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { formatHoraBogota } from '../utils/time';

export default function BarberTurnos() {
  const [barberos, setBarberos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [activeDate, setActiveDate] = useState('');
  const [activeBarbero, setActiveBarbero] = useState('');
  const dateTabsRef = useRef(null);
  const barberTabsRef = useRef(null);

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
    const unsubBarberos = onSnapshot(collection(db, 'barberos'), snapshot => {
      setBarberos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubTurnos = onSnapshot(collection(db, 'turnos'), snapshot => {
      setTurnos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      unsubBarberos();
      unsubTurnos();
    };
  }, []);

  const dates = useMemo(
    () => Array.from(new Set(turnos.map(t => t.fecha))).sort(),
    [turnos]
  );

  const barberoNames = useMemo(
    () => barberos.map(b => b.nombre),
    [barberos]
  );

  useEffect(() => {
    if (dates.length > 0 && !dates.includes(activeDate)) {
      setActiveDate(dates[0]);
    }
  }, [dates, activeDate]);

  useEffect(() => {
    if (barberoNames.length > 0 && !barberoNames.includes(activeBarbero)) {
      setActiveBarbero(barberoNames[0]);
    }
  }, [barberoNames, activeBarbero]);

  const turnosDelBarbero = turnos.filter(
    t => t.barbero === activeBarbero && t.fecha === activeDate
  );

  if (dates.length === 0) {
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
          {dates.map(date => (
            <button
              key={date}
              role="tab"
              className={`tab ${activeDate === date ? 'tab-active' : ''}`}
              onClick={() => setActiveDate(date)}
            >
              {date}
            </button>
          ))}
        </div>
        <button onClick={() => scrollRight(dateTabsRef)} className="btn btn-square btn-sm ml-2">❯</button>
      </div>

      <div className="flex justify-center">
        <div role="tablist" className="tabs tabs-boxed overflow-x-auto" ref={barberTabsRef}>
          {barberoNames.map(name => (
            <button
              key={name}
              role="tab"
              className={`tab ${activeBarbero === name ? 'tab-active' : ''}`}
              onClick={() => setActiveBarbero(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 mt-4">
        <h3 className="font-bold mb-2">{activeBarbero}</h3>
        {turnosDelBarbero.length === 0 ? (
          <p className="text-sm italic">Sin turnos</p>
        ) : (
          <div className="grid gap-2">
            {turnosDelBarbero.map(t => (
              <div key={t.id} className="card bg-base-100 shadow-md p-4">
                <div className="flex justify-between items-start">
                  <p className="font-semibold">
                    {formatHoraBogota(t.hora)} - {t.nombre}
                  </p>
                  <span
                    className={`badge ${
                      (t.estado || 'pendiente') === 'pendiente'
                        ? 'badge-info'
                        : (t.estado || 'pendiente') === 'atendido'
                        ? 'badge-success'
                        : 'badge-error'
                    }`}
                  >
                    {t.estado || 'pendiente'}
                  </span>
                </div>
                <p className="text-sm">Servicio: {t.servicio}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

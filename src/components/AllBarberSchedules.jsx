import { useEffect, useState, useMemo, useRef } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { formatHoraBogota } from '../utils/time';

export default function AllBarberSchedules() {
  const [barberos, setBarberos] = useState([]);
  const [slots, setSlots] = useState([]);
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
    const unsubBarberos = onSnapshot(collection(db, 'barberos'), snap => {
      setBarberos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubSlots = onSnapshot(collection(db, 'disponibilidades'), snap => {
      setSlots(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubTurnos = onSnapshot(collection(db, 'turnos'), snap => {
      setTurnos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      unsubBarberos();
      unsubSlots();
      unsubTurnos();
    };
  }, []);

  const dates = useMemo(
    () => Array.from(new Set(slots.map(s => s.fecha))).sort(),
    [slots]
  );

  useEffect(() => {
    if (dates.length > 0 && !dates.includes(activeDate)) {
      setActiveDate(dates[0]);
    }
  }, [dates, activeDate]);

  const barberoNames = useMemo(() => barberos.map(b => b.nombre), [barberos]);

  useEffect(() => {
    if (barberoNames.length > 0 && !barberoNames.includes(activeBarbero)) {
      setActiveBarbero(barberoNames[0]);
    }
  }, [barberoNames, activeBarbero]);

  const slotsDelBarbero = slots.filter(
    s => s.barbero === activeBarbero && s.fecha === activeDate
  );

  if (dates.length === 0) {
    return <p>No hay horarios cargados.</p>;
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
        {slotsDelBarbero.length === 0 ? (
          <p className="text-sm italic">Sin horarios</p>
        ) : (
          <div className="grid gap-2">
            {slotsDelBarbero.map(s => {
              const agendado = turnos.some(
                t =>
                  t.fecha === s.fecha &&
                  t.hora === s.hora &&
                  t.barbero === s.barbero
              );
              return (
                <div key={s.id} className="card bg-base-100 shadow-md p-4">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold">
                      {formatHoraBogota(s.hora)} - {s.servicio}
                    </p>
                    {agendado && (
                      <span className="badge badge-success">Agendado</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, useMemo, useRef } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { formatHoraBogota } from '../utils/time';

export default function AllBarberSchedules() {
  const [barberos, setBarberos] = useState([]);
  const [slots, setSlots] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [activeDate, setActiveDate] = useState('');
  const [filter, setFilter] = useState('');
  const tabsRef = useRef(null);

  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 150, behavior: 'smooth' });
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

  const grouped = barberos
    .filter(b => b.nombre.toLowerCase().includes(filter.toLowerCase()))
    .map(b => ({
      ...b,
      slots: slots.filter(s => s.barbero === b.nombre && s.fecha === activeDate),
    }));

  if (dates.length === 0) {
    return <p>No hay horarios cargados.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <button onClick={scrollLeft} className="btn btn-square btn-sm mr-2">❮</button>
        <div
          ref={tabsRef}
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
        <button onClick={scrollRight} className="btn btn-square btn-sm ml-2">❯</button>
      </div>

      <input
        type="text"
        placeholder="Filtrar barbero"
        className="input input-bordered w-full max-w-xs"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <div className="space-y-6 mt-4">
        {grouped.map(barbero => (
          <div key={barbero.id} className="space-y-2">
            <h3 className="font-bold mb-2">{barbero.nombre}</h3>
            {barbero.slots.length === 0 ? (
              <p className="text-sm italic">Sin horarios</p>
            ) : (
              <div className="grid gap-2">
                {barbero.slots.map(s => {
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
        ))}
      </div>
    </div>
  );
}

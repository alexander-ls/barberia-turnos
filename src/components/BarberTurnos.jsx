import { useEffect, useState, useMemo, useRef } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { formatHoraBogota } from '../utils/time';

export default function BarberTurnos() {
  const [barberos, setBarberos] = useState([]);
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

  useEffect(() => {
    if (dates.length > 0 && !dates.includes(activeDate)) {
      setActiveDate(dates[0]);
    }
  }, [dates, activeDate]);

  const turnosPorBarbero = barberos
    .filter(b => b.nombre.toLowerCase().includes(filter.toLowerCase()))
    .map(b => ({
      ...b,
      turnos: turnos.filter(
        t => t.barbero === b.nombre && t.fecha === activeDate
      ),
    }));

  if (dates.length === 0) {
    return <p>No hay turnos registrados.</p>;
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
        {turnosPorBarbero.map(barbero => (
          <div key={barbero.id} className="space-y-2">
            <h3 className="font-bold mb-2">{barbero.nombre}</h3>
            {barbero.turnos.length === 0 ? (
              <p className="text-sm italic">Sin turnos</p>
            ) : (
              <div className="grid gap-2">
                {barbero.turnos.map(t => (
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
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState, useMemo, useRef } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { getTodayBogota, formatHoraBogota } from '../utils/time';

export default function BarberMisTurnos() {
  const [turnos, setTurnos] = useState([]);
  const [activeDate, setActiveDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('pendiente');
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

  const dates = useMemo(() => {
    const today = getTodayBogota();
    const unique = Array.from(new Set(turnos.map(t => t.fecha)));
    return unique
      .filter(d => d >= today)
      .sort();
  }, [turnos]);

  useEffect(() => {
    if (dates.length > 0 && !dates.includes(activeDate)) {
      setActiveDate(dates[0]);
    }
  }, [dates, activeDate]);

  useEffect(() => {
    let unsubTurnos;
    let unsubBarbero;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const qBarbero = query(
          collection(db, 'barberos'),
          where('email', '==', user.email)
        );
        unsubBarbero = onSnapshot(qBarbero, (snap) => {
          if (!snap.empty) {
            const nombre = snap.docs[0].data().nombre;
            const qTurnos = query(
              collection(db, 'turnos'),
              where('barbero', '==', nombre)
            );
            unsubTurnos = onSnapshot(qTurnos, (s) => {
              setTurnos(s.docs.map((d) => ({ id: d.id, ...d.data() })));
            });
          } else {
            setTurnos([]);
          }
        });
      } else {
        setTurnos([]);
      }
    });
    return () => {
      if (unsubTurnos) unsubTurnos();
      if (unsubBarbero) unsubBarbero();
      unsubAuth();
    };
  }, []);

  const actualizarEstado = async (id, estado) => {
    await updateDoc(doc(db, 'turnos', id), { estado });
  };

  if (turnos.length === 0) {
    return <p>No tienes turnos asignados.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <button onClick={scrollLeft} className="btn btn-square btn-sm mr-2">
          ❮
        </button>
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
        <button onClick={scrollRight} className="btn btn-square btn-sm ml-2">
          ❯
        </button>
      </div>

      <div className="flex justify-center">
        <div role="tablist" className="tabs tabs-boxed">
          {[
            { key: 'pendiente', label: 'Pendientes' },
            { key: 'todos', label: 'Todos' },
            { key: 'atendido', label: 'Atendidos' },
            { key: 'cancelado', label: 'Cancelados' },
          ].map(opt => (
            <button
              key={opt.key}
              role="tab"
              className={`tab ${statusFilter === opt.key ? 'tab-active' : ''}`}
              onClick={() => setStatusFilter(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {turnos
          .filter(t => t.fecha === activeDate)
          .filter(t =>
            statusFilter === 'todos'
              ? true
              : (t.estado || 'pendiente') === statusFilter
          )
          .map(t => (
            <div key={t.id} className="card bg-base-100 shadow-md p-4 space-y-2">
              <div className="flex justify-between items-start">
                <p className="font-semibold">{t.nombre}</p>
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
              <p>
                {t.fecha} {formatHoraBogota(t.hora)} - {t.servicio}
              </p>
              <div className="space-x-2">
                <button
                  disabled={(t.estado || 'pendiente') !== 'pendiente'}
                  onClick={() => actualizarEstado(t.id, 'atendido')}
                  className="btn btn-xs btn-success"
                >
                  ✔ Marcar como atendido
                </button>
                <button
                  disabled={(t.estado || 'pendiente') !== 'pendiente'}
                  onClick={() => actualizarEstado(t.id, 'cancelado')}
                  className="btn btn-xs btn-error"
                >
                  ✖ Cancelar turno
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

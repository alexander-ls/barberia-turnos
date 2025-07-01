import { useEffect, useState, useMemo, useRef } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function BarberMisTurnos() {
  const [turnos, setTurnos] = useState([]);
  const [activeDate, setActiveDate] = useState('');
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
    const today = new Date().toISOString().split('T')[0];
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
          className="tabs tabs-bordered flex-1 overflow-x-auto whitespace-nowrap scroll-smooth"
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

      <div className="grid gap-4">
        {turnos
          .filter(t => t.fecha === activeDate)
          .map(t => (
            <div key={t.id} className="card bg-base-100 shadow-md p-4">
              <p className="font-semibold">{t.nombre}</p>
              <p>
                {t.fecha} {t.hora} - {t.servicio}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

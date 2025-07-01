import { useEffect, useState, useMemo, useRef } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function BarberScheduleList() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
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
    const unique = Array.from(new Set(slots.map(s => s.fecha)));
    return unique
      .filter(d => d >= today)
      .sort();
  }, [slots]);

  useEffect(() => {
    if (dates.length > 0 && !dates.includes(activeDate)) {
      setActiveDate(dates[0]);
    }
  }, [dates, activeDate]);

  useEffect(() => {
    let unsubSlots;
    let unsubTurnos;
    let unsubBarbero;
    const unsubAuth = onAuthStateChanged(auth, user => {
      if (user) {
        const qBarbero = query(collection(db, 'barberos'), where('email', '==', user.email));
        unsubBarbero = onSnapshot(qBarbero, snap => {
          if (!snap.empty) {
            const nombre = snap.docs[0].data().nombre;
            const q = query(collection(db, 'disponibilidades'), where('barbero', '==', nombre));
            unsubSlots = onSnapshot(q, s => {
              setSlots(s.docs.map(d => ({ id: d.id, ...d.data() })));
            });
            const qt = query(collection(db, 'turnos'), where('barbero', '==', nombre));
            unsubTurnos = onSnapshot(qt, t => {
              setBookings(t.docs.map(d => ({ id: d.id, ...d.data() })));
            });
          } else {
            setSlots([]);
          }
        });
      } else {
        setSlots([]);
      }
    });
    return () => {
      if (unsubSlots) unsubSlots();
      if (unsubTurnos) unsubTurnos();
      if (unsubBarbero) unsubBarbero();
      unsubAuth();
    };
  }, []);

  const eliminar = async id => {
    await deleteDoc(doc(db, 'disponibilidades', id));
  };

  if (slots.length === 0) {
    return <p>No hay horarios cargados.</p>;
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
        {slots
          .filter(s => s.fecha === activeDate)
          .map(s => {
            const agendado = bookings.some(
              b => b.fecha === s.fecha && b.hora === s.hora
            );
            return (
              <div key={s.id} className="card bg-base-100 shadow-md p-4">
                <div className="flex justify-between items-start">
                  <p className="font-semibold">
                    {s.fecha} {s.hora}
                  </p>
                  <button
                    onClick={() => eliminar(s.id)}
                    className="btn btn-xs btn-error"
                  >
                    Eliminar
                  </button>
                </div>
                <p>{s.servicio}</p>
                {agendado && (
                  <span className="badge badge-success mt-2">Agendado</span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

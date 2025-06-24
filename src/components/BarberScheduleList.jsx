import { useEffect, useState } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function BarberScheduleList() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

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

  return (
    <div className="grid gap-4">
      {slots.map(s => {
        const agendado = bookings.some(b => b.fecha === s.fecha && b.hora === s.hora);
        return (
          <div key={s.id} className="card bg-base-100 shadow-md p-4">
            <div className="flex justify-between items-start">
              <p className="font-semibold">
                {s.fecha} {s.hora}
              </p>
              <button onClick={() => eliminar(s.id)} className="btn btn-xs btn-error">
                Eliminar
              </button>
            </div>
            <p>{s.servicio}</p>
            {agendado && <span className="badge badge-success mt-2">Agendado</span>}
          </div>
        );
      })}
    </div>
  );
}

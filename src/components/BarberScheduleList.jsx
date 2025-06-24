import { useEffect, useState } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function BarberScheduleList() {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    let unsubSlots;
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
      if (unsubBarbero) unsubBarbero();
      unsubAuth();
    };
  }, []);

  const eliminar = async id => {
    await deleteDoc(doc(db, 'disponibilidades', id));
  };

  return (
    <div className="grid gap-4">
      {slots.map(s => (
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
        </div>
      ))}
    </div>
  );
}

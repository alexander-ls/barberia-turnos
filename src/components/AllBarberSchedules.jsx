import { useEffect, useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

export default function AllBarberSchedules() {
  const [barberos, setBarberos] = useState([]);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const unsubBarberos = onSnapshot(collection(db, 'barberos'), snap => {
      setBarberos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubSlots = onSnapshot(collection(db, 'disponibilidades'), snap => {
      setSlots(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      unsubBarberos();
      unsubSlots();
    };
  }, []);

  const grouped = barberos.map(b => ({
    ...b,
    slots: slots.filter(s => s.barbero === b.nombre),
  }));

  return (
    <div className="space-y-6 mt-4">
      {grouped.map(barbero => (
        <div key={barbero.id}>
          <h3 className="font-bold mb-2">{barbero.nombre}</h3>
          <ul className="ml-4 list-disc space-y-1">
            {barbero.slots.map(s => (
              <li key={s.id}>
                {s.fecha} {s.hora} - {s.servicio}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

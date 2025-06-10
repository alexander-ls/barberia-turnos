import { useEffect, useState } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function BarberMisTurnos() {
  const [turnos, setTurnos] = useState([]);

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

  return (
    <div className="grid gap-4">
      {turnos.map((t) => (
        <div key={t.id} className="card bg-base-100 shadow-md p-4">
          <p className="font-semibold">{t.nombre}</p>
          <p>
            {t.fecha} {t.hora} - {t.servicio}
          </p>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { formatHoraBogota } from '../utils/time';

export default function BarberTurnos() {
  const [barberos, setBarberos] = useState([]);
  const [turnos, setTurnos] = useState([]);

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

  const turnosPorBarbero = barberos.map(b => ({
    ...b,
    turnos: turnos.filter(t => t.barbero === b.nombre),
  }));

  return (
    <div className="space-y-6 mt-4">
      {turnosPorBarbero.map(barbero => (
        <div key={barbero.id}>
          <h3 className="font-bold mb-2">{barbero.nombre}</h3>
          <ul className="ml-4 list-disc space-y-1">
            {barbero.turnos.map(t => (
              <li key={t.id}>
                {t.fecha} {formatHoraBogota(t.hora)} - {t.nombre}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function BarberHorarioForm() {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [barbero, setBarbero] = useState('');

  useEffect(() => {
    let unsubBarbero;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const qBarbero = query(collection(db, 'barberos'), where('email', '==', user.email));
        unsubBarbero = onSnapshot(qBarbero, (snap) => {
          if (!snap.empty) {
            setBarbero(snap.docs[0].data().nombre);
          } else {
            setBarbero('');
          }
        });
      } else {
        setBarbero('');
      }
    });
    return () => {
      if (unsubBarbero) unsubBarbero();
      unsubAuth();
    };
  }, []);

  const guardarHorario = async () => {
    if (!fecha || !hora || !barbero) return;
    await addDoc(collection(db, 'horarios'), {
      barbero,
      fecha,
      hora,
      timestamp: new Date(),
    });
    setFecha('');
    setHora('');
  };

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <input
        type="date"
        className="border p-2 rounded"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      <input
        type="time"
        className="border p-2 rounded"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
      />
      <button
        onClick={guardarHorario}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Guardar horario
      </button>
    </div>
  );
}

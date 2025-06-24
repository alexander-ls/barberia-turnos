import { useEffect, useState } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function BarberHorarioList() {
  const [horarios, setHorarios] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFecha, setEditFecha] = useState('');
  const [editHora, setEditHora] = useState('');

  useEffect(() => {
    let unsubHorarios;
    let unsubBarbero;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const qBarbero = query(collection(db, 'barberos'), where('email', '==', user.email));
        unsubBarbero = onSnapshot(qBarbero, (snap) => {
          if (!snap.empty) {
            const nombre = snap.docs[0].data().nombre;
            const qHorarios = query(collection(db, 'horarios'), where('barbero', '==', nombre));
            unsubHorarios = onSnapshot(qHorarios, (s) => {
              setHorarios(s.docs.map((d) => ({ id: d.id, ...d.data() })));
            });
          } else {
            setHorarios([]);
          }
        });
      } else {
        setHorarios([]);
      }
    });
    return () => {
      if (unsubHorarios) unsubHorarios();
      if (unsubBarbero) unsubBarbero();
      unsubAuth();
    };
  }, []);

  const startEdit = (h) => {
    setEditingId(h.id);
    setEditFecha(h.fecha);
    setEditHora(h.hora);
  };

  const guardarEdicion = async (id) => {
    if (!editFecha || !editHora) return;
    await updateDoc(doc(db, 'horarios', id), {
      fecha: editFecha,
      hora: editHora,
    });
    setEditingId(null);
  };

  const eliminarHorario = async (id) => {
    await deleteDoc(doc(db, 'horarios', id));
  };

  return (
    <div className="grid gap-4">
      {horarios.map((h) => (
        <div key={h.id} className="card bg-base-100 shadow-md p-4">
          {editingId === h.id ? (
            <div className="space-y-2">
              <input
                type="date"
                className="border p-2 rounded"
                value={editFecha}
                onChange={(e) => setEditFecha(e.target.value)}
              />
              <input
                type="time"
                className="border p-2 rounded"
                value={editHora}
                onChange={(e) => setEditHora(e.target.value)}
              />
              <div className="space-x-2">
                <button onClick={() => guardarEdicion(h.id)} className="btn btn-primary btn-sm">
                  Guardar
                </button>
                <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{h.fecha}</p>
                <p>{h.hora}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => startEdit(h)} className="btn btn-sm">
                  Editar
                </button>
                <button onClick={() => eliminarHorario(h.id)} className="btn btn-error btn-sm">
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

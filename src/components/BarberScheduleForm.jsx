import { useState, useEffect } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function BarberScheduleForm() {
  const [barbero, setBarbero] = useState('');
  const [servicio, setServicio] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const canSave = barbero && servicio && fecha && hora && !loading;

  useEffect(() => {
    const unsubServicios = onSnapshot(collection(db, 'servicios'), snap => {
      setServicios(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    let unsubBarbero;
    const unsubAuth = onAuthStateChanged(auth, user => {
      if (user) {
        const q = query(collection(db, 'barberos'), where('email', '==', user.email));
        unsubBarbero = onSnapshot(q, snap => {
          if (!snap.empty) setBarbero(snap.docs[0].data().nombre);
        });
      }
    });
    return () => {
      unsubServicios();
      unsubAuth();
      if (unsubBarbero) unsubBarbero();
    };
  }, []);

  useEffect(() => {
    if (toast.message) {
      const t = setTimeout(() => setToast({ message: '', type: '' }), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const guardar = async () => {
    if (!barbero || !servicio || !fecha || !hora) {
      setToast({ message: 'Complete todos los campos', type: 'error' });
      return;
    }
    if (loading) return;
    try {
      setLoading(true);
      await addDoc(collection(db, 'disponibilidades'), {
        barbero,
        servicio,
        fecha,
        hora,
        timestamp: new Date(),
      });
      setToast({ message: 'Horario guardado correctamente', type: 'success' });
      setServicio('');
      setFecha('');
      setHora('');
    } catch (err) {
      console.error(err);
      setToast({ message: 'Hubo un error al guardar', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <p className="font-semibold">Barbero: {barbero || 'Cargando...'}</p>
      <select className="border p-2 rounded" value={servicio} onChange={e => setServicio(e.target.value)}>
        <option value="">Seleccione un servicio</option>
        {servicios.map(s => (
          <option key={s.id} value={s.nombre}>{s.nombre}</option>
        ))}
      </select>
      <input type="date" className="border p-2 rounded" value={fecha} onChange={e => setFecha(e.target.value)} />
      <input type="time" className="border p-2 rounded" value={hora} onChange={e => setHora(e.target.value)} />
      <button onClick={guardar} className="btn btn-primary" disabled={!canSave}>
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          'Agregar horario'
        )}
      </button>
      {toast.message && (
        <div className="toast toast-top toast-end">
          <div className={`alert ${toast.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

export default function BarberList() {
  const [barberos, setBarberos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editImagen, setEditImagen] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'barberos'), (snapshot) => {
      setBarberos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const eliminarBarbero = async (id) => {
    await deleteDoc(doc(db, 'barberos', id));
  };

  const comenzarEdicion = (barbero) => {
    setEditId(barbero.id);
    setEditNombre(barbero.nombre);
    setEditEmail(barbero.email || '');
    setEditTelefono(barbero.telefono || '');
    setEditImagen(barbero.imagen || '');
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditNombre('');
    setEditEmail('');
    setEditTelefono('');
    setEditImagen('');
  };

  const guardarEdicion = async () => {
    if (!editNombre || !editEmail || !editTelefono) return;
    await updateDoc(doc(db, 'barberos', editId), {
      nombre: editNombre,
      email: editEmail,
      telefono: editTelefono,
      imagen: editImagen,
    });
    cancelarEdicion();
  };

  return (
    <div className="grid gap-4">
      {barberos.map((barbero) => (
        <div key={barbero.id} className="card bg-base-100 shadow-md p-4">
          {editId === barbero.id ? (
            <div className="space-y-2">
              <input
                className="border p-1 rounded w-full"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
              />
              <input
                className="border p-1 rounded w-full"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <input
                className="border p-1 rounded w-full"
                value={editTelefono}
                onChange={(e) => setEditTelefono(e.target.value)}
              />
              <input
                className="border p-1 rounded w-full"
                value={editImagen}
                onChange={(e) => setEditImagen(e.target.value)}
                placeholder="URL de la imagen"
              />
              <div className="flex justify-end space-x-2">
                <button onClick={guardarEdicion} className="btn btn-xs btn-primary">
                  Guardar
                </button>
                <button onClick={cancelarEdicion} className="btn btn-xs">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  {barbero.imagen ? (
                    <div className="w-12 rounded-full">
                      <img src={barbero.imagen} alt={barbero.nombre} />
                    </div>
                  ) : (
                    <div className="bg-neutral text-neutral-content rounded-full w-12 flex items-center justify-center">
                      <span className="text-lg">{barbero.nombre.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{barbero.nombre}</p>
                  {barbero.email && <p>{barbero.email}</p>}
                  {barbero.telefono && <p>{barbero.telefono}</p>}
                </div>
              </div>
              <div className="space-x-2">
                <button onClick={() => comenzarEdicion(barbero)} className="btn btn-xs">
                  Editar
                </button>
                <button
                  onClick={() => eliminarBarbero(barbero.id)}
                  className="btn btn-xs btn-error"
                >
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

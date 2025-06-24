import { useEffect, useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

export default function ServiceList() {
  const [servicios, setServicios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editPrecio, setEditPrecio] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'servicios'), (snapshot) => {
      setServicios(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const comenzarEdicion = (servicio) => {
    setEditId(servicio.id);
    setEditNombre(servicio.nombre);
    setEditPrecio(servicio.precio || '');
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditNombre('');
    setEditPrecio('');
  };

  const guardarEdicion = async () => {
    if (!editNombre || !editPrecio) return;
    await updateDoc(doc(db, 'servicios', editId), {
      nombre: editNombre,
      precio: parseFloat(editPrecio),
    });
    cancelarEdicion();
  };

  const eliminarServicio = async (id) => {
    await deleteDoc(doc(db, 'servicios', id));
  };

  return (
    <ul className="space-y-2">
      {servicios.map((servicio) => (
        <li key={servicio.id} className="p-2 border rounded">
          {editId === servicio.id ? (
            <div className="space-y-2">
              <input
                className="border p-1 rounded w-full"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
              />
              <input
                className="border p-1 rounded w-full"
                type="number"
                value={editPrecio}
                onChange={(e) => setEditPrecio(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={guardarEdicion}
                  className="btn btn-sm btn-primary"
                >
                  Guardar
                </button>
                <button
                  onClick={cancelarEdicion}
                  className="btn btn-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span>
                {servicio.nombre}
                {servicio.precio ? ` - $${servicio.precio}` : ''}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => comenzarEdicion(servicio)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarServicio(servicio.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

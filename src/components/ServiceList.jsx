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
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editImagen, setEditImagen] = useState('');

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
    setEditDescripcion(servicio.descripcion || '');
    setEditImagen(servicio.imagen || '');
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditNombre('');
    setEditPrecio('');
    setEditDescripcion('');
    setEditImagen('');
  };

  const guardarEdicion = async () => {
    if (!editNombre || !editPrecio) return;
    await updateDoc(doc(db, 'servicios', editId), {
      nombre: editNombre,
      precio: parseFloat(editPrecio),
      descripcion: editDescripcion,
      imagen: editImagen,
    });
    cancelarEdicion();
  };

  const eliminarServicio = async (id) => {
    await deleteDoc(doc(db, 'servicios', id));
  };

  return (
    <div className="grid gap-4">
      {servicios.map((servicio) => (
        <div key={servicio.id} className="card bg-base-100 shadow-md p-4">
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
            <textarea
              className="border p-1 rounded w-full"
              value={editDescripcion}
              onChange={(e) => setEditDescripcion(e.target.value)}
            />
            <input
              className="border p-1 rounded w-full"
              value={editImagen}
              onChange={(e) => setEditImagen(e.target.value)}
              placeholder="URL de la imagen"
            />
              <div className="flex justify-end space-x-2">
                <button onClick={guardarEdicion} className="btn btn-sm btn-primary">
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
            <div>
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
              {servicio.imagen && (
                <img
                  src={servicio.imagen}
                  alt={servicio.nombre}
                  className="w-20 h-20 object-contain mt-2"
                />
              )}
              {servicio.descripcion && (
                <p className="text-sm opacity-80 mt-1">{servicio.descripcion}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

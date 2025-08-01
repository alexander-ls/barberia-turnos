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
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    imagen: '',
    categoria: '',
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'servicios'), snap => {
      setServicios(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const openEdit = servicio => {
    setEditing(servicio);
    setForm({
      nombre: servicio.nombre || '',
      precio: servicio.precio || '',
      descripcion: servicio.descripcion || '',
      imagen: servicio.imagen || '',
      categoria: servicio.categoria || '',
    });
  };

  const closeEdit = () => setEditing(null);

  const saveEdit = async () => {
    if (!form.nombre || !form.precio) return;
    await updateDoc(doc(db, 'servicios', editing.id), {
      nombre: form.nombre,
      precio: parseFloat(form.precio),
      descripcion: form.descripcion,
      imagen: form.imagen,
      categoria: form.categoria,
    });
    closeEdit();
  };

  const eliminarServicio = async id => {
    await deleteDoc(doc(db, 'servicios', id));
  };

  const badgeClass = cat => {
    switch (cat) {
      case 'Corte':
        return 'badge-primary';
      case 'Afeitado':
        return 'badge-secondary';
      case 'Color':
        return 'badge-accent';
      default:
        return 'badge-ghost';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Categoría</th>
            <th className="text-right">$</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(s => (
            <tr key={s.id}>
              <td>{s.nombre}</td>
              <td>
                {s.categoria ? (
                  <span className={`badge ${badgeClass(s.categoria)}`}>{s.categoria}</span>
                ) : (
                  '-'
                )}
              </td>
              <td className="text-right">
                {s.precio ? `$${s.precio}` : '-'}
              </td>
              <td className="space-x-2">
                <button
                  onClick={() => openEdit(s)}
                  className="btn btn-xs btn-outline"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarServicio(s.id)}
                  className="btn btn-xs btn-ghost text-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className="modal modal-open">
          <div className="modal-box space-y-2">
            <h3 className="font-bold text-lg mb-2">Editar servicio</h3>
            <input
              className="input input-bordered w-full"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre"
            />
            <input
              className="input input-bordered w-full"
              type="number"
              value={form.precio}
              onChange={e => setForm({ ...form, precio: e.target.value })}
              placeholder="Precio"
            />
            <input
              className="input input-bordered w-full"
              value={form.categoria}
              onChange={e => setForm({ ...form, categoria: e.target.value })}
              placeholder="Categoría"
            />
            <textarea
              className="textarea textarea-bordered w-full"
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Descripción"
            />
            <input
              className="input input-bordered w-full"
              value={form.imagen}
              onChange={e => setForm({ ...form, imagen: e.target.value })}
              placeholder="URL de la imagen"
            />
            <div className="modal-action">
              <button onClick={saveEdit} className="btn btn-primary btn-sm">
                Guardar
              </button>
              <button onClick={closeEdit} className="btn btn-sm">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

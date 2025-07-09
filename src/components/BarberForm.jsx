import { useState } from 'react';
import { db, firebaseConfig } from '../auth/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function BarberForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [imagen, setImagen] = useState('');

  const guardarBarbero = async () => {
    if (!nombre || !email || !telefono || !password) return;

    // crear usuario sin afectar la sesión actual
    const auxApp = initializeApp(firebaseConfig, 'aux');
    const auxAuth = getAuth(auxApp);
    await createUserWithEmailAndPassword(auxAuth, email, password);

    await addDoc(collection(db, 'barberos'), {
      nombre,
      email,
      telefono,
      imagen,
      timestamp: new Date(),
    });

    setNombre('');
    setEmail('');
    setTelefono('');
    setPassword('');
    setImagen('');
  };

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <input
        className="border p-2 rounded"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del barbero"
      />
      <input
        className="border p-2 rounded"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
      />
      <input
        className="border p-2 rounded"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="Teléfono"
      />
      <input
        className="border p-2 rounded"
        value={imagen}
        onChange={(e) => setImagen(e.target.value)}
        placeholder="URL de la imagen"
      />
      <input
        className="border p-2 rounded"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button
        onClick={guardarBarbero}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Guardar barbero
      </button>
    </div>
  );
}

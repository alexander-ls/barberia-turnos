import { useState } from 'react';
import { db, firebaseConfig, storage } from '../auth/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function BarberForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [imagenFile, setImagenFile] = useState(null);

  const guardarBarbero = async () => {
    if (!nombre || !email || !telefono || !password) return;

    // crear usuario sin afectar la sesión actual
    const auxApp = initializeApp(firebaseConfig, 'aux');
    const auxAuth = getAuth(auxApp);
    await createUserWithEmailAndPassword(auxAuth, email, password);

    let imagenUrl = '';
    if (imagenFile) {
      const fileRef = ref(
        storage,
        `barberos/${Date.now()}_${imagenFile.name}`
      );
      await uploadBytes(fileRef, imagenFile);
      imagenUrl = await getDownloadURL(fileRef);
    }

    await addDoc(collection(db, 'barberos'), {
      nombre,
      email,
      telefono,
      ...(imagenUrl && { imagen: imagenUrl }),
      timestamp: new Date(),
    });

    setNombre('');
    setEmail('');
    setTelefono('');
    setPassword('');
    setImagenFile(null);
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
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <input
        className="border p-2 rounded"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setImagenFile(file);
        }}
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

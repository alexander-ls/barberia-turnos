import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../auth/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function BarberProfile() {
  const { id } = useParams();
  const [barbero, setBarbero] = useState(null);

  useEffect(() => {
    async function fetchBarber() {
      const snap = await getDoc(doc(db, 'barberos', id));
      if (snap.exists()) {
        setBarbero({ id: snap.id, ...snap.data() });
      }
    }
    fetchBarber();
  }, [id]);

  if (!barbero) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  return (
    <div className="p-6 flex flex-col items-center space-y-4">
      <div className="avatar">
        <div className="w-32 rounded-full">
          <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
        </div>
      </div>
      <h1 className="text-3xl font-bold">{barbero.nombre}</h1>
      {barbero.email && <p className="text-lg">{barbero.email}</p>}
    </div>
  );
}

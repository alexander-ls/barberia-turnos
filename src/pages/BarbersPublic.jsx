import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../auth/FirebaseConfig';
import { Link } from 'react-router-dom';

export default function BarbersPublic() {
  const [barberos, setBarberos] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'barberos'), snap => {
      setBarberos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Nuestros Barberos</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {barberos.map(b => (
          <Link
            key={b.id}
            to={`/barberos/${b.id}`}
            className="card bg-base-200 rounded-lg shadow transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="card-body items-center text-center">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                </div>
              </div>
              <h2 className="card-title">{b.nombre}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

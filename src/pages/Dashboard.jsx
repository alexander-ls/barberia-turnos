import TurnosList from '../components/TurnosList';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/FirebaseConfig';

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email ?? '');
    });
    return unsubscribe;
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="hero bg-base-200 rounded-lg">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold">
              Bienvenido{userEmail ? `, ${userEmail}` : ''}
            </h1>
            <p className="py-2">Estos son tus turnos programados</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Listado de Turnos</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <TurnosList />
        </div>
      </div>
    </div>
  );
}
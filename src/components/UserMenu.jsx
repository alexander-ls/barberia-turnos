import { useEffect, useState } from 'react';
import { auth, db } from '../auth/FirebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function UserMenu() {
  const [name, setName] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async user => {
      if (user) {
        const q = query(collection(db, 'barberos'), where('email', '==', user.email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setName(snap.docs[0].data().nombre);
        } else {
          setName(user.email);
        }
      }
    });
    return unsub;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.hash = '/';
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
        <div className="bg-neutral text-neutral-content rounded-full w-10">
          <span className="text-lg">{name ? name.charAt(0).toUpperCase() : '?'}</span>
        </div>
      </div>
      <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
        <li className="px-4 py-2 font-semibold">{name}</li>
        <li>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </li>
      </ul>
    </div>
  );
}

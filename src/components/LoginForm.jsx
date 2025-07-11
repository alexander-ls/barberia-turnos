import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../auth/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ADMIN_EMAILS = ['super@hotmail.com'];

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      let destination = '/';
      if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        destination = '/admin';
      } else {
        const q = query(collection(db, 'barberos'), where('email', '==', email));
        const snap = await getDocs(q);
        if (!snap.empty) destination = '/barbero';
      }
      navigate(destination);
    } catch (error) {
      alert('Error de autenticación');
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col space-y-4">
      <input
        className="input input-bordered w-full"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="input input-bordered w-full"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button type="submit" className="btn btn-primary">
        Ingresar
      </button>
    </form>
  );
}
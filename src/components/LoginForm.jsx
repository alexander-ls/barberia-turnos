import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../auth/FirebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      alert('Error de autenticación');
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col space-y-2 max-w-sm mx-auto">
      <input
        className="border p-2 rounded"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="border p-2 rounded"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Ingresar
      </button>
    </form>
  );
}
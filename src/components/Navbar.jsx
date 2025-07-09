import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <header
      className={`navbar bg-base-200 justify-between px-4 fixed top-0 left-0 right-0 z-50 transition-shadow ${
        scrolled ? 'shadow-lg' : ''
      }`}
    >
      <Link to="/" className="btn btn-ghost text-xl">
        Barber Shop BEXS
      </Link>
      <nav className="space-x-2">
        <Link to="/servicios" className="btn btn-ghost btn-sm">
          Servicios
        </Link>
        <Link to="/barberos" className="btn btn-ghost btn-sm">
          Barberos
        </Link>
        <Link to="/agendar" className="btn btn-primary btn-sm">
          Agendar
        </Link>
        <a href="#/login" className="btn btn-ghost btn-sm">
          Iniciar sesión
        </a>
      </nav>
    </header>
  );
}

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../auth/FirebaseConfig';
import hero from '../assets/barber.svg';

export default function Landing() {
  const [servicios, setServicios] = useState([]);
  const [barberos, setBarberos] = useState([]);

  useEffect(() => {
    const unsubServ = onSnapshot(collection(db, 'servicios'), snap => {
      setServicios(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubBarb = onSnapshot(collection(db, 'barberos'), snap => {
      setBarberos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      unsubServ();
      unsubBarb();
    };
  }, []);

  return (
    <div>
      <header className="p-4 flex justify-end bg-base-200">
        <a href="#/login" className="btn btn-outline">Iniciar sesión</a>
      </header>
      <section
        className="relative hero min-h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="relative hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-4 text-5xl font-bold">Barbería</h1>
            <p className="mb-4">
              Los mejores estilos y cortes profesionales para ti.
            </p>
            <a href="#/agendar" className="btn btn-primary">Agendar Turno</a>
          </div>
        </div>
      </section>
      <section id="servicios" class="py-16 px-6 max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold mb-10 text-center">Nuestros Servicios</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <ul class="text-lg space-y-4">
            {servicios.map(s => (
              <li class="flex justify-between border-b pb-2">
                <span>{s.nombre}</span>
                {s.precio && (
                  <span>${s.precio}</span>
                )}
              </li>
            ))}
          </ul>
          <img src="https://joseppons.com/formacion/wp-content/uploads/2021/05/estudiar-barberia.jpg" alt="Fade" class="rounded-lg shadow" />
        </div>
      </section>


      <section class="bg-gray-100 py-16 px-6">
        <h2 class="text-3xl font-bold mb-10 text-center">Conoce a Nuestros Barberos</h2>
        <div class="flex flex-wrap justify-center gap-8">

        {barberos.map(b => (
            <div key={b.id} className="text-center">
              <div class="avatar">
              <div class="w-24 rounded-full">
                <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
              </div>
            </div>
            <p class="font-medium">{b.nombre}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

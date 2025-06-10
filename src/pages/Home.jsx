import LoginForm from '../components/LoginForm';
import logo from '../assets/barber.svg';

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col w-full max-w-md">
        <img src={logo} alt="Logo Barbería" className="w-32 mb-4 logo-main" />
        <h1 className="text-3xl font-bold mb-4 text-center">Bienvenido a la Barbería</h1>
        <div className="card w-full shadow-2xl bg-base-100">
          <div className="card-body">
            <LoginForm />
          </div>
        </div>
        <a href="#/agendar" className="text-blue-600 hover:underline mt-4">
          Agendar un turno sin registrarse
        </a>
      </div>
    </div>
  );
}
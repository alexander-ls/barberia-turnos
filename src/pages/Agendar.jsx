import TurnoForm from '../components/TurnoForm';
import logo from '../assets/barber.svg';

export default function Agendar() {
  return (
    <div className="hero min-h-screen bg-base-200 p-4">
      <div className="hero-content flex-col w-full max-w-md">
        <img src={logo} alt="Logo Barbería" className="w-32 mb-4 logo-main" />
        <h1 className="text-3xl font-bold mb-4 text-center">Agendar Turno</h1>
        <div className="card w-full shadow-2xl bg-base-100">
          <div className="card-body">
            <TurnoForm />
          </div>
        </div>
      </div>
    </div>
  );
}

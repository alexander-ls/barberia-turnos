import LoginForm from '../components/LoginForm';

export default function Home() {
  return (
    <div className="text-center mt-8 space-y-4">
      <h1 className="text-3xl font-bold">Bienvenido a la Barbería</h1>
      <LoginForm />
    </div>
  );
}
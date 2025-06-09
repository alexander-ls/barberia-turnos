import LoginForm from '../components/LoginForm';

export default function Home() {
  return (
    <div className="text-center mt-8">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a la Barbería</h1>
      <LoginForm />
    </div>
  );
}
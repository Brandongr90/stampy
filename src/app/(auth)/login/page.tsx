import { LoginForm } from '@/components/auth';

export const metadata = {
  title: 'Iniciar Sesion - Stampy',
  description: 'Inicia sesion en tu cuenta de Stampy',
};

export default function LoginPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display font-bold text-almost-black mb-2">
          Bienvenido de vuelta
        </h1>
        <p className="text-charcoal">
          Ingresa tus datos para acceder a tu cuenta
        </p>
      </div>
      <LoginForm />
    </>
  );
}

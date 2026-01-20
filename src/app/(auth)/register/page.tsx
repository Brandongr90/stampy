import { RegisterForm } from '@/components/auth';

export const metadata = {
  title: 'Crear Cuenta - Stampy',
  description: 'Crea tu cuenta de Stampy y comienza a fidelizar clientes',
};

export default function RegisterPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display font-bold text-almost-black mb-2">
          Crea tu cuenta
        </h1>
        <p className="text-charcoal">
          Comienza a crear tarjetas de lealtad en minutos
        </p>
      </div>
      <RegisterForm />
    </>
  );
}

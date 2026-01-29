import { getTranslations } from 'next-intl/server';
import { RegisterForm } from '@/components/auth';

export async function generateMetadata() {
  const t = await getTranslations('Metadata');
  return {
    title: t('registerTitle'),
    description: t('registerDescription'),
  };
}

export default async function RegisterPage() {
  const t = await getTranslations('Auth.register');

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display font-bold text-almost-black mb-2">
          {t('title')}
        </h1>
        <p className="text-charcoal">
          {t('subtitle')}
        </p>
      </div>
      <RegisterForm />
    </>
  );
}

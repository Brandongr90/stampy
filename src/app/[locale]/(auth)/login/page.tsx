import { getTranslations } from 'next-intl/server';
import { LoginForm } from '@/components/auth';

export async function generateMetadata() {
  const t = await getTranslations('Metadata');
  return {
    title: t('loginTitle'),
    description: t('loginDescription'),
  };
}

export default async function LoginPage() {
  const t = await getTranslations('Auth.login');

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
      <LoginForm />
    </>
  );
}

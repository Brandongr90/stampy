import { getTranslations } from 'next-intl/server';
import { Pricing } from '@/components/marketing';

export async function generateMetadata() {
  const t = await getTranslations('Metadata');
  return {
    title: t('pricingTitle'),
    description: t('pricingDescription'),
  };
}

export default function PricingPage() {
  return (
    <div className="pt-20">
      <Pricing />
    </div>
  );
}

import { Pricing } from '@/components/marketing';

export const metadata = {
  title: 'Precios - Stampy',
  description: 'Planes simples y transparentes para tu negocio',
};

export default function PricingPage() {
  return (
    <div className="pt-20">
      <Pricing />
    </div>
  );
}

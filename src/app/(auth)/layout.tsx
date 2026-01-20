import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Blobs */}
      <div className="blob-mint -top-32 -right-32" />
      <div className="blob-mint -bottom-32 -left-32" style={{ animationDelay: '-10s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-mint-500 rounded-xl flex items-center justify-center">
            <span className="text-almost-black font-bold text-2xl">S</span>
          </div>
          <span className="font-display font-bold text-2xl text-almost-black">Stampy</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-large p-8 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}

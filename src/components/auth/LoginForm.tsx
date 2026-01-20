'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - replace with actual auth logic
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="email"
          placeholder="correo@ejemplo.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="pl-12"
          required
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Tu contrasena"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="pl-12 pr-12"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-mint-600 focus:ring-mint-500" />
          <span className="text-sm text-charcoal">Recordarme</span>
        </label>
        <Link href="#" className="text-sm text-mint-600 hover:text-mint-700 font-medium">
          Olvidaste tu contrasena?
        </Link>
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
        {isLoading ? 'Iniciando sesion...' : 'Iniciar Sesion'}
      </Button>

      <p className="text-center text-sm text-charcoal">
        No tienes cuenta?{' '}
        <Link href="/register" className="text-mint-600 hover:text-mint-700 font-medium">
          Registrate
        </Link>
      </p>
    </form>
  );
}

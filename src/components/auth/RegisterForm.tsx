'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'El nombre del negocio es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo invalido';
    }

    if (!formData.password) {
      newErrors.password = 'La contrasena es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contrasena debe tener al menos 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contrasenas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    // Simulate registration - replace with actual auth logic
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="relative">
        <Building2 className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Nombre del negocio"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          className="pl-12"
          error={errors.businessName}
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
        <Input
          type="email"
          placeholder="correo@ejemplo.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="pl-12"
          error={errors.email}
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Contrasena (min. 8 caracteres)"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="pl-12 pr-12"
          error={errors.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative">
        <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirmar contrasena"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="pl-12 pr-12"
          error={errors.confirmPassword}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 mt-1 rounded border-gray-300 text-mint-600 focus:ring-mint-500"
          required
        />
        <span className="text-sm text-charcoal">
          Acepto los{' '}
          <Link href="#" className="text-mint-600 hover:text-mint-700">
            Terminos de Servicio
          </Link>{' '}
          y la{' '}
          <Link href="#" className="text-mint-600 hover:text-mint-700">
            Politica de Privacidad
          </Link>
        </span>
      </label>

      <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>

      <p className="text-center text-sm text-charcoal">
        Ya tienes cuenta?{' '}
        <Link href="/login" className="text-mint-600 hover:text-mint-700 font-medium">
          Inicia sesion
        </Link>
      </p>
    </form>
  );
}

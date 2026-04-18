import React, { useState } from 'react';
// import { useForm } from 'react-hook-form'; // COMENTADO: Usando controlled form manual con useState
// import { zodResolver } from '@hookform/resolvers/zod'; // COMENTADO: No necesario para form manual
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../../shared/components';
import { Button } from '../../../../shared/components/button';
import { useAuth } from '../../hooks/useAuth';
// import { loginSchema, type LoginFormData } from '../../validators/auth.validators'; // COMENTADO
import './LoginForm.css';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // === CONTROLLED FORM MANUAL CON useState ===
  // Estado para los valores del formulario
  // const [formData, setFormData] = useState({
  //   email: '',
  //   password: '',
  // });
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Estado para los errores de validación
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Handler genérico para cambios en inputs de texto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validación manual (puedes usar zod aquí si quieres)
  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir submit nativo del form

    if (!validate()) return; // No enviar si hay errores

    try {
      clearError();
      await login(formData); // Usar formData del estado
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="login-form" noValidate>
      <div className="login-form-header">
        <h1 className="login-form-title">{t('auth.login.title')}</h1>
        <p className="login-form-subtitle">
          {t('auth.login.subtitle')}
        </p>
      </div>

      {error && (
        <div className="login-form-error" role="alert">
          <svg
            className="login-form-error-icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      <div className="login-form-fields">
        <Input
          // {...register('email')} // REEMPLAZADO POR controlled manual:
          name="email"
          // value={formData.email}
          onChange={handleChange}
          type="email"
          label={t('auth.login.email')}
          placeholder={t('auth.login.emailPlaceholder')}
          error={errors.email} // Ya no es errors.email?.message
          fullWidth
          autoComplete="email"
          required
        />

        <div className="password-field-wrapper">
          <Input
            // {...register('password')} // REEMPLAZADO POR controlled manual:
            name="password"
            // value={formData.password}
            onChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            label={t('auth.login.password')}
            placeholder={t('auth.login.passwordPlaceholder')}
            error={errors.password} // Ya no es errors.password?.message
            fullWidth
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
          >
            {showPassword ? (
              <svg
                className="password-toggle-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="password-toggle-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="login-form-options">
          <a href="/forgot-password" className="forgot-password-link">
            {t('auth.login.forgotPassword')}
          </a>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? t('auth.login.submitting') : t('auth.login.submit')}
      </Button>

      <div className="login-form-footer">
        <p className="signup-text">
          {t('auth.login.noAccount')}{' '}
          <a href="/register" className="signup-link">
            {t('auth.login.signUp')}
          </a>
        </p>
      </div>
    </form>
  );
};

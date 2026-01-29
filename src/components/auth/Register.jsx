import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Icons } from '../ui/Icons';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { t } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.companyName);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else if (err.code === 'auth/weak-password') {
        setError('Mot de passe trop faible');
      } else {
        setError('Erreur lors de l\'inscription. Réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Icons.fileText width={40} height={40} />
          </div>
          <h1>MaFacture</h1>
          <p>{t('register')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <Icons.x width={16} height={16} />
              <span>{error}</span>
            </div>
          )}

          <Input
            label={t('companyName')}
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Nom de votre entreprise"
            required
          />

          <Input
            label={t('email')}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            required
          />

          <Input
            label={t('password')}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            helper="Minimum 6 caractères"
            required
          />

          <Input
            label={t('confirmPassword')}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            size="lg"
          >
            {t('register')}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            {t('hasAccount')}{' '}
            <Link to="/login">{t('login')}</Link>
          </p>
        </div>
      </div>

      <div className="auth-bg">
        <div className="auth-bg-content">
          <h2>Rejoignez MaFacture</h2>
          <ul className="auth-features">
            <li>
              <Icons.check width={20} height={20} />
              <span>Factures professionnelles</span>
            </li>
            <li>
              <Icons.check width={20} height={20} />
              <span>Sauvegarde dans le cloud</span>
            </li>
            <li>
              <Icons.check width={20} height={20} />
              <span>Téléchargement PDF</span>
            </li>
            <li>
              <Icons.check width={20} height={20} />
              <span>Gestion des clients</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
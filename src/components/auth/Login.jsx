import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Icons } from '../ui/Icons';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('Aucun compte trouvé avec cet email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else {
        setError('Erreur de connexion. Réessayez.');
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
          <p>{t('login')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <Icons.x width={16} height={16} />
              <span>{error}</span>
            </div>
          )}

          <Input
            label={t('email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            icon={<Icons.users width={18} height={18} />}
          />

          <Input
            label={t('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {t('login')}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            {t('noAccount')}{' '}
            <Link to="/register">{t('register')}</Link>
          </p>
        </div>
      </div>

      <div className="auth-bg">
        <div className="auth-bg-content">
          <h2>Gérez vos factures facilement</h2>
          <p>Créez des factures professionnelles en quelques clics</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Auth
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './components/dashboard/Dashboard';
import InvoiceList from './components/dashboard/InvoiceList';
import ClientList from './components/dashboard/ClientList';
import InvoiceForm from './components/invoice/InvoiceForm';
import Settings from './components/settings/Settings';

// Styles
import './styles/globals.css';

// Route protégée
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loader"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Route publique (redirige si connecté)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : children;
};

// Composant principal avec routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Routes protégées */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="invoices/new" element={<InvoiceForm />} />
        <Route path="invoices/:id" element={<InvoiceForm />} />
        <Route path="invoices/:id/edit" element={<InvoiceForm />} />
        <Route path="clients" element={<ClientList />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 - Redirection */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// App avec providers
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
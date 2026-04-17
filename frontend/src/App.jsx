import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import BusinessesPage from './pages/BusinessesPage';
import VendorsPage from './pages/VendorsPage';
import InvoicesPage from './pages/InvoicesPage';
import BankAccountsPage from './pages/BankAccountsPage';
import StatementsPage from './pages/StatementsPage';
import ReconciliationPage from './pages/ReconciliationPage';
import AppShell from './pages/AppShell';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          )}
        >
          <Route index element={<Dashboard />} />
          <Route path="businesses" element={<BusinessesPage />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="bank-accounts" element={<BankAccountsPage />} />
          <Route path="statements" element={<StatementsPage />} />
          <Route path="reconciliation" element={<ReconciliationPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/dashboard/Dashboard';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute'; // Import the guard
import useAuthStore from './store/useAuthStore';

function App() {

  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Check token validity whenever the app loads or tab is refreshed
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* You can add more private routes here later, like /settings or /invoices */}
        </Route>


      </Routes>
    </Router>
  );
}

export default App;

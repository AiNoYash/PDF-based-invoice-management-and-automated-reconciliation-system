import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute'; // Import the guard

function App() {
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

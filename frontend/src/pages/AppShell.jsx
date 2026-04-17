import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Workspace.css';

const navItems = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/dashboard/businesses', label: 'Businesses' },
  { to: '/dashboard/vendors', label: 'Vendors' },
  { to: '/dashboard/invoices', label: 'Invoices' },
  { to: '/dashboard/bank-accounts', label: 'Bank Accounts' },
  { to: '/dashboard/statements', label: 'Statements' },
  { to: '/dashboard/reconciliation', label: 'Reconciliation' }
];

function AppShell() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="workspace-root">
      <aside className="workspace-sidebar">
        <h1 className="workspace-brand">ReconFlow</h1>
        <p className="workspace-tagline">Financial Ops Command Center</p>
        <nav className="workspace-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) => `workspace-link ${isActive ? 'workspace-link-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="workspace-logout" onClick={logout}>Log out</button>
      </aside>
      <main className="workspace-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link to={to} onClick={() => setMenuOpen(false)} style={{
      color: isActive(to) ? 'var(--green)' : 'var(--text2)',
      fontWeight: isActive(to) ? 700 : 400,
      fontSize: 14,
      padding: '6px 12px',
      borderRadius: 8,
      background: isActive(to) ? 'rgba(0,255,136,0.08)' : 'transparent',
      transition: 'all 0.2s',
      display: 'block'
    }}>{label}</Link>
  );

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(6,13,10,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--green), var(--green2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 0 16px rgba(0,255,136,0.3)'
          }}>🍽</div>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5 }}>BudgetBite</span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }} className="desktop-nav">
          {navLink('/', 'Home')}
          {navLink('/search', 'Compare Prices')}
          {navLink('/budget', 'Budget Planner')}
          {user && navLink('/saved', 'My Combos')}
          {isAdmin && navLink('/admin', 'Admin')}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontSize: 13, color: 'var(--text2)', display: 'none' }} className="show-md">
                {user.name}
              </span>
              <button onClick={handleLogout} style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text2)', padding: '7px 16px', borderRadius: 10,
                cursor: 'pointer', fontSize: 13, fontWeight: 600
              }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: 'var(--text2)', fontSize: 13, fontWeight: 600,
                padding: '7px 16px', borderRadius: 10,
                border: '1px solid var(--border)',
              }}>Login</Link>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg, var(--green), var(--green2))',
                color: '#000', fontSize: 13, fontWeight: 800,
                padding: '7px 16px', borderRadius: 10, display: 'block'
              }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

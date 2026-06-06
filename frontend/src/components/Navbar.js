import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Search',  path: '/search' },
  { label: 'Budget Planner', path: '/budget' },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(6,13,10,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px', height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #00ff88, #00cc55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 0 12px rgba(0,255,136,0.4)',
        }}>🍽</div>
        <div>
          <div style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: 18, lineHeight: 1 }}>BudgetBite</div>
          <div style={{ fontSize: 9, color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: 1.5 }}>BEST PRICE ALWAYS</div>
        </div>
      </Link>

      {/* Desktop nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
        {NAV_LINKS.map(l => (
          <Link key={l.path} to={l.path} style={{
            padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            color: location.pathname === l.path ? 'var(--accent)' : 'var(--text2)',
            background: location.pathname === l.path ? 'rgba(0,255,136,0.08)' : 'transparent',
            transition: 'all 0.2s',
          }}>{l.label}</Link>
        ))}
        {isAdmin && (
          <Link to="/admin" style={{
            padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            color: location.pathname.startsWith('/admin') ? 'var(--orange)' : 'var(--text2)',
            background: location.pathname.startsWith('/admin') ? 'rgba(255,140,0,0.08)' : 'transparent',
          }}>Admin</Link>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <div ref={dropRef} style={{ position: 'relative' }}>
            <button onClick={() => setDropOpen(o => !o)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '7px 14px', color: 'var(--text)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#000',
              }}>{user.name[0].toUpperCase()}</div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>▼</span>
            </button>

            {dropOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 14, minWidth: 180, overflow: 'hidden',
                boxShadow: 'var(--shadow)', zIndex: 200,
              }}>
                {[
                  { label: '👤 Profile',   path: '/profile' },
                  { label: '❤️ Wishlist',  path: '/wishlist' },
                  { label: '🎯 Budget',    path: '/budget' },
                ].map(item => (
                  <Link key={item.path} to={item.path} onClick={() => setDropOpen(false)} style={{
                    display: 'block', padding: '12px 16px', fontSize: 14,
                    color: 'var(--text2)', transition: 'background 0.15s',
                    borderBottom: '1px solid var(--border)',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >{item.label}</Link>
                ))}
                <button onClick={handleLogout} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '12px 16px', fontSize: 14, color: 'var(--red)',
                  background: 'transparent', border: 'none',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >🚪 Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/login"    className="btn btn-secondary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary  btn-sm">Sign Up</Link>
          </div>
        )}

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(o => !o)} style={{
          display: 'none', background: 'none', border: 'none',
          color: 'var(--text)', fontSize: 22,
        }} className="mobile-menu-btn">{menuOpen ? '✕' : '☰'}</button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          padding: 16, zIndex: 99,
        }}>
          {NAV_LINKS.map(l => (
            <Link key={l.path} to={l.path} style={{
              display: 'block', padding: '12px 16px', fontSize: 15,
              color: location.pathname === l.path ? 'var(--accent)' : 'var(--text)',
              borderRadius: 10, marginBottom: 4,
            }}>{l.label}</Link>
          ))}
          {!user && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Link to="/login"    className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
              <Link to="/register" className="btn btn-primary"   style={{ flex: 1, justifyContent: 'center' }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

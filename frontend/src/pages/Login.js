import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍽</div>
          <h1 style={{ fontFamily: 'Clash Display', fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text2)' }}>Sign in to your BudgetBite account</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {error && (
            <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: 'var(--red)', fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handle}
                placeholder="you@example.com" required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handle}
                placeholder="••••••••" required />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', borderRadius: 14 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--bg3)', borderRadius: 12, fontSize: 12, color: 'var(--text3)' }}>
            <strong style={{ color: 'var(--text2)' }}>Demo accounts:</strong><br />
            Admin: admin@budgetbite.com / admin123<br />
            User: user@budgetbite.com / user123
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text2)', fontSize: 14 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', city: 'Mumbai' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.city);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h1 style={{ fontFamily: 'Clash Display', fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Join BudgetBite</h1>
          <p style={{ color: 'var(--text2)' }}>Start saving money on every food order</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {error && (
            <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: 'var(--red)', fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email',     name: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Password',  name: 'password', type: 'password', placeholder: 'Min 6 characters' },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>{field.label}</label>
                <input name={field.name} type={field.type} value={form[field.name]} onChange={handle}
                  placeholder={field.placeholder} required />
              </div>
            ))}

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>City</label>
              <select name="city" value={form.city} onChange={handle}>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', borderRadius: 14 }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text2)', fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

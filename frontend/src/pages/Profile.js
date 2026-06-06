import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm]     = useState({ name: user.name, city: user.city, budget: user.budget });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const handle   = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePw = e => setPwForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setPwSaving(true);
    try {
      await api.put('/auth/change-password', pwForm);
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally { setPwSaving(false); }
  };

  return (
    <div className="page-container" style={{ maxWidth: 640 }}>
      <h1 style={{ fontFamily: 'Clash Display', fontSize: 30, marginBottom: 28 }}>My Profile</h1>

      {/* Profile card */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 20, alignItems: 'center', padding: '24px 28px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, fontWeight: 700, color: '#000', flexShrink: 0,
        }}>{user.name[0].toUpperCase()}</div>
        <div>
          <div style={{ fontFamily: 'Clash Display', fontSize: 22, fontWeight: 700 }}>{user.name}</div>
          <div style={{ color: 'var(--text2)', fontSize: 14 }}>{user.email}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <span className="badge badge-green">{user.role}</span>
            <span style={{ fontSize: 13, color: 'var(--text3)' }}>📍 {user.city}</span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Clash Display', fontSize: 20, marginBottom: 20 }}>Edit Profile</h2>
        <form onSubmit={saveProfile}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Full Name</label>
            <input name="name" value={form.name} onChange={handle} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>City</label>
            <select name="city" value={form.city} onChange={handle}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
              Default Budget — <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono' }}>₹{form.budget}</span>
            </label>
            <input type="range" name="budget" min={100} max={1000} step={50}
              value={form.budget} onChange={handle}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text3)', fontSize: 11, fontFamily: 'JetBrains Mono', marginTop: 4 }}>
              <span>₹100</span><span>₹1000</span>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="card">
        <h2 style={{ fontFamily: 'Clash Display', fontSize: 20, marginBottom: 20 }}>Change Password</h2>
        <form onSubmit={changePassword}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Current Password</label>
            <input name="currentPassword" type="password" value={pwForm.currentPassword} onChange={handlePw} required />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>New Password</label>
            <input name="newPassword" type="password" value={pwForm.newPassword} onChange={handlePw} required />
          </div>
          <button type="submit" disabled={pwSaving} className="btn btn-primary">
            {pwSaving ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

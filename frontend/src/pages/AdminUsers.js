import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);

  useEffect(() => { fetchUsers(); }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=15${search ? `&search=${search}` : ''}`);
      setUsers(res.data.users);
      setTotal(res.data.total);
    } finally { setLoading(false); }
  };

  const toggleUser = async (userId, name) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle`);
      setUsers(u => u.map(x => x._id === userId ? res.data.user : x));
      toast.success(`${name} ${res.data.user.isActive ? 'activated' : 'deactivated'}`);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const changeRole = async (userId, role) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role });
      setUsers(u => u.map(x => x._id === userId ? res.data.user : x));
      toast.success('Role updated!');
    } catch { toast.error('Failed'); }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="page-container" style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <Link to="/admin" style={{ color: 'var(--text3)', fontSize: 14 }}>← Dashboard</Link>
          <h1 style={{ fontFamily: 'Clash Display', fontSize: 28, fontWeight: 700, marginTop: 4 }}>Manage Users</h1>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 2 }}>{total} total users</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchUsers()}
          placeholder="Search by name or email..." style={{ maxWidth: 360 }} />
        <button onClick={fetchUsers} className="btn btn-secondary">Search</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['User', 'Email', 'City', 'Role', 'Budget', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, color: 'var(--text3)', fontFamily: 'JetBrains Mono', letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={8} style={{ padding: 12 }}><div className="skeleton" style={{ height: 40, borderRadius: 8 }} /></td></tr>
              )) : users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: user.role === 'admin'
                          ? 'linear-gradient(135deg, var(--orange), #ff6600)'
                          : 'linear-gradient(135deg, var(--accent), var(--accent2))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: '#000', flexShrink: 0,
                      }}>{user.name[0].toUpperCase()}</div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: 13 }}>{user.email}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: 13 }}>{user.city}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <select value={user.role}
                      onChange={e => changeRole(user._id, e.target.value)}
                      disabled={user._id === me._id}
                      style={{ padding: '5px 10px', fontSize: 12, width: 'auto', borderRadius: 8 }}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--accent)' }}>₹{user.budget}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${user.isActive ? 'badge-green' : 'badge-red'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text3)', fontSize: 12 }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => toggleUser(user._id, user.name)}
                      disabled={user._id === me._id}
                      className={`btn btn-sm ${user.isActive ? 'btn-danger' : 'btn-secondary'}`}
                      style={{ opacity: user._id === me._id ? 0.4 : 1 }}
                    >{user.isActive ? 'Deactivate' : 'Activate'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 16, borderTop: '1px solid var(--border)' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-secondary btn-sm">← Prev</button>
            <span style={{ padding: '7px 14px', fontSize: 13, color: 'var(--text2)' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-secondary btn-sm">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

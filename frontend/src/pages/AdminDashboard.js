import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const StatCard = ({ label, value, sub, color = 'var(--accent)', icon }) => (
  <div className="card" style={{ borderColor: `${color}33` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'JetBrains Mono', marginBottom: 8 }}>{label}</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 36, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 32 }}>{icon}</div>
    </div>
  </div>
);

const customTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ color: 'var(--text2)', fontSize: 12 }}>{label}</div>
      <div style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{payload[0].value}</div>
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-container">
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {Array(4).fill(0).map((_, i) => <div key={i} className="card skeleton" style={{ height: 110 }} />)}
      </div>
      <div className="card skeleton" style={{ height: 280 }} />
    </div>
  );

  return (
    <div className="page-container" style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Clash Display', fontSize: 32, fontWeight: 700 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>Platform overview & analytics</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/foods" className="btn btn-secondary">🍽 Manage Foods</Link>
          <Link to="/admin/users" className="btn btn-secondary">👥 Manage Users</Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard label="Total Users"   value={stats?.stats.totalUsers}   icon="👥" color="var(--accent)" sub={`+${stats?.stats.newUsers} this week`} />
        <StatCard label="Food Items"    value={stats?.stats.totalFoods}   icon="🍽" color="#6C3CE1" />
        <StatCard label="Total Searches" value={stats?.stats.totalSearches} icon="🔍" color="#FF5200" />
        <StatCard label="Budget Plans"  value={stats?.stats.totalPlans}   icon="🎯" color="#00D290" />
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Searches chart */}
        <div className="card">
          <h3 style={{ fontFamily: 'Clash Display', fontSize: 18, marginBottom: 20 }}>Searches (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats?.searchesByDay || []}>
              <XAxis dataKey="_id" tick={{ fontSize: 11, fill: 'var(--text3)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} />
              <Tooltip content={customTooltip} />
              <Line type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top searches */}
        <div className="card">
          <h3 style={{ fontFamily: 'Clash Display', fontSize: 18, marginBottom: 20 }}>Top Search Queries</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats?.topSearches?.slice(0, 6) || []} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text3)' }} />
              <YAxis type="category" dataKey="_id" tick={{ fontSize: 11, fill: 'var(--text2)' }} width={90} />
              <Tooltip content={customTooltip} />
              <Bar dataKey="count" fill="var(--accent)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2">
        {/* Top foods */}
        <div className="card">
          <h3 style={{ fontFamily: 'Clash Display', fontSize: 18, marginBottom: 16 }}>Most Viewed Dishes</h3>
          {stats?.topFoods?.map((f, i) => (
            <div key={f._id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: i < stats.topFoods.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text3)', minWidth: 20 }}>#{i + 1}</span>
                <span style={{ fontSize: 22 }}>{f.emoji}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{f.category}</div>
                </div>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--accent)' }}>{f.totalOrders} views</span>
            </div>
          ))}
        </div>

        {/* Recent searches */}
        <div className="card">
          <h3 style={{ fontFamily: 'Clash Display', fontSize: 18, marginBottom: 16 }}>Recent Searches</h3>
          {stats?.recentSearches?.slice(0, 8).map((s, i) => (
            <div key={s._id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: i < 7 ? '1px solid var(--border)' : 'none',
            }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>"{s.query}"</span>
                {s.user && <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 8 }}>by {s.user.name}</span>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--accent2)' }}>{s.results} results</div>
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>{new Date(s.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

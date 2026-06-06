import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminFoods() {
  const [foods, setFoods]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editFood, setEditFood] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', category: 'North Indian', emoji: '🍽️', description: '', isVeg: true, isTrending: false });

  const CATEGORIES = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Fast Food', 'Biryani', 'Beverages', 'Desserts', 'Snacks'];

  useEffect(() => { fetchFoods(); }, []);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await api.get('/foods?limit=100');
      setFoods(res.data.foods);
    } finally { setLoading(false); }
  };

  const filtered = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (food) => {
    setEditFood(food);
    setForm({ name: food.name, slug: food.slug, category: food.category, emoji: food.emoji, description: food.description, isVeg: food.isVeg, isTrending: food.isTrending });
    setShowForm(true);
  };

  const openNew = () => {
    setEditFood(null);
    setForm({ name: '', slug: '', category: 'North Indian', emoji: '🍽️', description: '', isVeg: true, isTrending: false });
    setShowForm(true);
  };

  const saveFood = async (e) => {
    e.preventDefault();
    try {
      if (!form.slug) form.slug = form.name.toLowerCase().replace(/\s+/g, '-');
      if (editFood) {
        const res = await api.put(`/foods/${editFood._id}`, form);
        setFoods(f => f.map(x => x._id === editFood._id ? res.data.food : x));
        toast.success('Food updated!');
      } else {
        const res = await api.post('/foods', form);
        setFoods(f => [res.data.food, ...f]);
        toast.success('Food created!');
      }
      setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const deleteFood = async (id) => {
    if (!window.confirm('Deactivate this food item?')) return;
    try {
      await api.delete(`/foods/${id}`);
      setFoods(f => f.filter(x => x._id !== id));
      toast.success('Food deactivated');
    } catch { toast.error('Failed'); }
  };

  const toggleTrending = async (food) => {
    try {
      const res = await api.put(`/foods/${food._id}`, { isTrending: !food.isTrending });
      setFoods(f => f.map(x => x._id === food._id ? res.data.food : x));
      toast.success(`${food.name} ${!food.isTrending ? 'marked trending' : 'removed from trending'}`);
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="page-container" style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/admin" style={{ color: 'var(--text3)', fontSize: 14 }}>← Dashboard</Link>
          </div>
          <h1 style={{ fontFamily: 'Clash Display', fontSize: 28, fontWeight: 700, marginTop: 4 }}>Manage Foods</h1>
        </div>
        <button onClick={openNew} className="btn btn-primary">+ Add Food</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search foods..." style={{ maxWidth: 360 }} />
      </div>

      {/* Form modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20,
        }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ fontFamily: 'Clash Display', fontSize: 22, marginBottom: 20 }}>
              {editFood ? 'Edit Food' : 'Add New Food'}
            </h2>
            <form onSubmit={saveFood}>
              {[
                { label: 'Food Name', name: 'name', type: 'text', placeholder: 'Butter Chicken' },
                { label: 'Slug (URL)', name: 'slug', type: 'text', placeholder: 'butter-chicken (auto-generated)' },
                { label: 'Emoji', name: 'emoji', type: 'text', placeholder: '🍛' },
                { label: 'Description', name: 'description', type: 'text', placeholder: 'Short description...' },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input name={f.name} type={f.type} value={form[f.name]} onChange={e => setForm(x => ({ ...x, [e.target.name]: e.target.value }))} placeholder={f.placeholder} />
                </div>
              ))}

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>Category</label>
                <select value={form.category} onChange={e => setForm(x => ({ ...x, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isVeg} onChange={e => setForm(x => ({ ...x, isVeg: e.target.checked }))} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
                  Vegetarian
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isTrending} onChange={e => setForm(x => ({ ...x, isTrending: e.target.checked }))} style={{ width: 'auto', accentColor: 'var(--orange)' }} />
                  Trending
                </label>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {editFood ? 'Save Changes' : 'Create Food'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Foods table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Food', 'Category', 'Platforms', 'Best Price', 'Trending', 'Orders', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text3)', fontFamily: 'JetBrains Mono', letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={7} style={{ padding: 12 }}><div className="skeleton" style={{ height: 40, borderRadius: 8 }} /></td></tr>
              )) : filtered.map(food => {
                const cheapest = food.platforms?.reduce((m, p) => p.price < (m?.price ?? Infinity) ? p : m, null);
                return (
                  <tr key={food._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 22 }}>{food.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{food.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, border: `1.5px solid ${food.isVeg ? '#00cc66' : '#cc0000'}` }}>
                              <div style={{ width: 4, height: 4, borderRadius: '50%', background: food.isVeg ? '#00cc66' : '#cc0000', margin: '1px' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: 13 }}>{food.category}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: 13 }}>{food.platforms?.length || 0}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono', fontSize: 14, color: 'var(--accent)' }}>
                      {cheapest ? `₹${cheapest.price}` : '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => toggleTrending(food)} style={{
                        background: food.isTrending ? 'rgba(255,140,0,0.15)' : 'var(--bg3)',
                        border: `1px solid ${food.isTrending ? 'var(--orange)' : 'var(--border)'}`,
                        color: food.isTrending ? 'var(--orange)' : 'var(--text3)',
                        borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600,
                      }}>{food.isTrending ? '🔥 Yes' : 'No'}</button>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: 13 }}>{food.totalOrders}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(food)} className="btn btn-secondary btn-sm">✏️</button>
                        <button onClick={() => deleteFood(food._id)} className="btn btn-danger btn-sm">🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

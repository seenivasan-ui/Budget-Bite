import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import FoodCard from '../components/FoodCard';

const PLATFORMS = [
  { name: 'Swiggy',   color: '#FF5200', emoji: '🧡' },
  { name: 'Zomato',   color: '#E23744', emoji: '❤️' },
  { name: 'Magicpin', color: '#6C3CE1', emoji: '💜' },
  { name: 'EatSure',  color: '#00A651', emoji: '💚' },
  { name: 'Dunzo',    color: '#00D290', emoji: '🩵' },
];

const STATS = [
  { label: 'Avg Savings',     value: '₹85',    suffix: 'per order' },
  { label: 'Platforms',       value: '5+',     suffix: 'compared' },
  { label: 'Foods Tracked',   value: '200+',   suffix: 'dishes' },
  { label: 'Coupons Found',   value: '50+',    suffix: 'auto-applied' },
];

export default function Home() {
  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending]     = useState([]);
  const [allFoods, setAllFoods]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    Promise.all([
      api.get('/foods/trending'),
      api.get('/foods?limit=8'),
    ]).then(([t, a]) => {
      setTrending(t.data.foods);
      setAllFoods(a.data.foods);
    }).finally(() => setLoading(false));
  }, []);

  const handleInput = (val) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (val.length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      const res = await api.get(`/search/suggestions?q=${val}`);
      setSuggestions(res.data.suggestions);
    }, 280);
  };

  const handleSearch = (q) => {
    const term = q || query;
    if (!term.trim()) return;
    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: '72vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.07) 0%, transparent 70%)',
      }}>
        {/* bg grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '80px 24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)',
            borderRadius: 20, padding: '6px 16px', marginBottom: 32, fontSize: 13,
            color: 'var(--accent)',
          }}>
            ⚡ Compare prices across all food apps instantly
          </div>

          <h1 style={{
            fontFamily: 'Clash Display', fontSize: 'clamp(40px,7vw,80px)',
            fontWeight: 700, lineHeight: 1.08, marginBottom: 20,
            letterSpacing: '-2px',
          }}>
            Stop Overpaying<br />
            <span style={{ color: 'var(--accent)' }}>for Food Delivery</span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px,2.5vw,19px)', color: 'var(--text2)',
            maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7,
          }}>
            BudgetBite finds the cheapest price for any dish across Swiggy, Zomato & more — and auto-applies the best coupon. Set a budget, get your perfect meal combo.
          </p>

          {/* Search bar */}
          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
            <div style={{
              display: 'flex', gap: 10,
              background: 'var(--bg2)', border: '1.5px solid var(--border)',
              borderRadius: 18, padding: '6px 6px 6px 20px',
              alignItems: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
              transition: 'border-color 0.2s',
            }}
              onFocus={() => {}} // handled by input
            >
              <span style={{ fontSize: 20 }}>🔍</span>
              <input
                value={query}
                onChange={e => handleInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search biryani, pizza, dosa..."
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  color: 'var(--text)', fontSize: 16, padding: '8px 0',
                  borderRadius: 0,
                }}
              />
              <button onClick={() => handleSearch()} className="btn btn-primary" style={{ borderRadius: 14 }}>
                Search
              </button>
            </div>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 14, overflow: 'hidden', zIndex: 50,
                boxShadow: 'var(--shadow)', textAlign: 'left',
              }}>
                {suggestions.map(s => (
                  <div key={s._id} onClick={() => { setQuery(s.name); handleSearch(s.name); }}
                    style={{
                      padding: '12px 16px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 12,
                      borderBottom: '1px solid var(--border)', fontSize: 14,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: 22 }}>{s.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick tags */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            {['Biryani', 'Pizza', 'Burger', 'Dosa', 'Noodles'].map(tag => (
              <button key={tag} onClick={() => handleSearch(tag)} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 20, padding: '6px 16px', color: 'var(--text2)',
                fontSize: 13, transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
              >{tag}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '40px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid-4">
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 36, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.suffix}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform pills */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'JetBrains Mono', marginBottom: 8 }}>Platforms we track</div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {PLATFORMS.map(p => (
              <div key={p.name} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg2)', border: `1px solid ${p.color}33`,
                borderRadius: 12, padding: '10px 20px',
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: 'Clash Display', fontSize: 28, fontWeight: 700 }}>🔥 Trending Now</h2>
                <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>Most ordered today across all platforms</p>
              </div>
              <Link to="/search?trending=true" className="btn btn-secondary btn-sm">View All →</Link>
            </div>
            <div className="grid-3">
              {loading ? Array(3).fill(0).map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: 160 }} />
              )) : trending.map(f => <FoodCard key={f._id} food={f} />)}
            </div>
          </div>
        </section>
      )}

      {/* All foods */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Clash Display', fontSize: 28, fontWeight: 700 }}>All Dishes</h2>
            <Link to="/search" className="btn btn-secondary btn-sm">Browse All →</Link>
          </div>
          <div className="grid-3">
            {loading ? Array(6).fill(0).map((_, i) => (
              <div key={i} className="card skeleton" style={{ height: 160 }} />
            )) : allFoods.map(f => <FoodCard key={f._id} food={f} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,255,136,0.08) 0%, rgba(0,204,102,0.04) 100%)',
            border: '1px solid rgba(0,255,136,0.2)',
            borderRadius: 24, padding: '48px 40px', textAlign: 'center',
          }}>
            <h2 style={{ fontFamily: 'Clash Display', fontSize: 36, marginBottom: 16 }}>
              Try the Budget Planner 🎯
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 16, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
              Enter your budget and we'll find the best meal combo across all platforms with coupons auto-applied.
            </p>
            <Link to="/budget" className="btn btn-primary btn-lg">Plan My Meal →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

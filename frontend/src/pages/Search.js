import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import FoodCard from '../components/FoodCard';
import { PlatformBadge, CouponTag, PriceTag } from '../components/FoodCard';

const CATEGORIES = ['All', 'North Indian', 'South Indian', 'Chinese', 'Italian', 'Fast Food', 'Biryani', 'Beverages', 'Desserts', 'Snacks'];
const PLATFORMS  = ['All', 'Swiggy', 'Zomato', 'Magicpin', 'EatSure', 'Dunzo'];

export default function Search() {
  const [params]       = useSearchParams();
  const navigate       = useNavigate();
  const [query, setQuery]         = useState(params.get('q') || '');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [searched, setSearched]   = useState(false);
  const [category, setCategory]   = useState('All');
  const [platform, setPlatform]   = useState('All');
  const [maxPrice, setMaxPrice]   = useState('');
  const [isVeg, setIsVeg]         = useState('all');
  const [viewMode, setViewMode]   = useState('grid'); // grid | compare
  const debounceRef = useRef(null);

  useEffect(() => {
    const q = params.get('q');
    if (q) { setQuery(q); doSearch(q); }
    else { loadAll(); }
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await api.get('/foods?limit=30');
      setResults(res.data.foods.map(f => ({ ...f, platforms: [...(f.platforms || [])].sort((a, b) => a.price - b.price) })));
      setSearched(false);
    } finally { setLoading(false); }
  };

  const doSearch = async (q, filters = {}) => {
    const term = q ?? query;
    if (!term.trim()) { loadAll(); return; }
    setLoading(true);
    setSearched(true);
    try {
      const qs = new URLSearchParams({ q: term });
      if (filters.maxPrice || maxPrice) qs.set('maxPrice', filters.maxPrice || maxPrice);
      if (filters.category || category !== 'All') qs.set('category', filters.category || category);
      if (filters.platform || platform !== 'All') qs.set('platform', filters.platform || platform);
      if (filters.isVeg || isVeg !== 'all') qs.set('isVeg', filters.isVeg || isVeg);
      const res = await api.get(`/search?${qs}`);
      setResults(res.data.results);
    } finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === 'Enter') doSearch(); };

  const handleFilter = (key, val) => {
    if (key === 'category') setCategory(val);
    if (key === 'platform') setPlatform(val);
    if (key === 'isVeg') setIsVeg(val);
    if (query) setTimeout(() => doSearch(query, { [key]: val }), 0);
  };

  return (
    <div className="page-container" style={{ maxWidth: 1100 }}>
      {/* Search bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex', gap: 10,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '6px 6px 6px 18px', alignItems: 'center',
        }}>
          <span>🔍</span>
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKey}
            placeholder="Search for any dish..."
            style={{ flex: 1, background: 'transparent', border: 'none', fontSize: 15, padding: '8px 0', borderRadius: 0 }}
          />
          {query && <button onClick={() => { setQuery(''); loadAll(); }} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 18 }}>✕</button>}
          <button onClick={() => doSearch()} className="btn btn-primary" style={{ borderRadius: 12 }}>Search</button>
        </div>
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Category */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => handleFilter('category', c)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: category === c ? 'var(--accent)' : 'var(--bg2)',
              color: category === c ? '#000' : 'var(--text2)',
              border: `1px solid ${category === c ? 'var(--accent)' : 'var(--border)'}`,
              transition: 'all 0.2s',
            }}>{c}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Platform filter */}
          <select value={platform} onChange={e => handleFilter('platform', e.target.value)}
            style={{ padding: '7px 12px', fontSize: 12, width: 'auto', borderRadius: 10 }}>
            {PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>

          {/* Veg filter */}
          <select value={isVeg} onChange={e => handleFilter('isVeg', e.target.value)}
            style={{ padding: '7px 12px', fontSize: 12, width: 'auto', borderRadius: 10 }}>
            <option value="all">All</option>
            <option value="true">Veg Only 🟢</option>
            <option value="false">Non-Veg 🔴</option>
          </select>

          {/* Max price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text2)' }}>Max ₹</span>
            <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="500" type="number"
              style={{ width: 80, padding: '7px 10px', fontSize: 12, borderRadius: 10 }}
            />
          </div>

          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            {[['grid', '⊞'], ['compare', '≡']].map(([mode, icon]) => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                padding: '7px 12px', border: 'none', fontSize: 14,
                background: viewMode === mode ? 'var(--bg3)' : 'transparent',
                color: viewMode === mode ? 'var(--accent)' : 'var(--text3)',
              }}>{icon}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results header */}
      {!loading && (
        <div style={{ marginBottom: 16, color: 'var(--text2)', fontSize: 14 }}>
          {searched
            ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
            : `Showing ${results.length} dishes`}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid-3">
          {Array(6).fill(0).map((_, i) => <div key={i} className="card skeleton" style={{ height: 160 }} />)}
        </div>
      )}

      {/* No results */}
      {!loading && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text2)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontFamily: 'Clash Display', marginBottom: 8 }}>No dishes found</h3>
          <p>Try a different search or adjust your filters</p>
        </div>
      )}

      {/* Grid view */}
      {!loading && results.length > 0 && viewMode === 'grid' && (
        <div className="grid-3">
          {results.map(f => <FoodCard key={f._id} food={f} />)}
        </div>
      )}

      {/* Compare view - shows all platforms side by side */}
      {!loading && results.length > 0 && viewMode === 'compare' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {results.map(food => {
            const sorted = [...(food.platforms || [])].sort((a, b) => a.price - b.price);
            const lowest = sorted[0]?.price;
            return (
              <div key={food._id} className="card" style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/food/${food.slug}`)}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 36, minWidth: 48, textAlign: 'center' }}>{food.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Clash Display', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{food.name}</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {sorted.map((p, i) => (
                        <div key={i} style={{
                          background: 'var(--bg3)', border: `1px solid ${p.price === lowest ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: 12, padding: '10px 14px', minWidth: 140,
                          boxShadow: p.price === lowest ? 'var(--glow)' : 'none',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <PlatformBadge platform={p.platform} />
                            {p.price === lowest && <span style={{ fontSize: 9, color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>BEST</span>}
                          </div>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 20, fontWeight: 700, color: p.price === lowest ? 'var(--accent)' : 'var(--text)' }}>₹{p.price}</div>
                          {p.originalPrice > p.price && <div style={{ fontSize: 11, color: 'var(--text3)', textDecoration: 'line-through' }}>₹{p.originalPrice}</div>}
                          {p.coupon && <CouponTag coupon={p.coupon} discount={p.couponDiscount} />}
                          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>⏱ {p.deliveryTime}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

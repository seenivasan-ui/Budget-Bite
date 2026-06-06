import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { PlatformBadge, CouponTag } from '../components/FoodCard';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STEPS = ['Scanning Swiggy...', 'Checking Zomato...', 'Finding Magicpin deals...', 'Applying coupons...', 'Optimizing combo...'];

export default function BudgetPlanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [budget, setBudget]     = useState(user?.budget || 300);
  const [category, setCategory] = useState('');
  const [isVeg, setIsVeg]       = useState('');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [stepIdx, setStepIdx]   = useState(0);
  const [progress, setProgress] = useState(0);
  const [saved, setSaved]       = useState(false);

  const optimize = async () => {
    setLoading(true); setResult(null); setSaved(false);
    setProgress(0); setStepIdx(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setStepIdx(Math.min(step, STEPS.length - 1));
      setProgress(Math.min((step / STEPS.length) * 90, 90));
      if (step >= STEPS.length) clearInterval(interval);
    }, 500);

    try {
      const body = { budget };
      if (category) body.category = category;
      if (isVeg !== '') body.isVeg = isVeg === 'true';
      const res = await api.post('/budget/optimize', body);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => { setResult(res.data); setLoading(false); }, 300);
    } catch (err) {
      clearInterval(interval);
      toast.error(err.response?.data?.error || 'Optimization failed');
      setLoading(false);
    }
  };

  const savePlan = async () => {
    if (!user) { toast.error('Login to save your plan'); navigate('/login'); return; }
    try {
      await api.post('/budget/save', result);
      setSaved(true);
      toast.success('Meal plan saved! 🎉');
    } catch { toast.error('Failed to save plan'); }
  };

  const PRESET_BUDGETS = [150, 200, 300, 500, 750];
  const CATEGORIES = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Fast Food', 'Biryani', 'Snacks'];

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
        <h1 style={{ fontFamily: 'Clash Display', fontSize: 36, fontWeight: 700, marginBottom: 10 }}>Budget Meal Planner</h1>
        <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.6 }}>
          Tell us your budget. We'll find the best combo of dishes across all platforms with coupons auto-applied — fitting exactly within your limit.
        </p>
      </div>

      {/* Budget config card */}
      <div className="card" style={{ marginBottom: 24 }}>
        {/* Budget slider */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <label style={{ fontWeight: 600, fontSize: 15 }}>Your Budget</label>
            <div style={{
              fontFamily: 'JetBrains Mono', fontSize: 32, fontWeight: 800,
              color: 'var(--accent)', background: 'rgba(0,255,136,0.08)',
              padding: '4px 16px', borderRadius: 10, border: '1px solid rgba(0,255,136,0.2)',
            }}>₹{budget}</div>
          </div>

          <input type="range" min={100} max={1000} step={50} value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)', height: 6, cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text3)', fontSize: 11, fontFamily: 'JetBrains Mono', marginTop: 6 }}>
            <span>₹100</span><span>₹1000</span>
          </div>

          {/* Preset buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {PRESET_BUDGETS.map(b => (
              <button key={b} onClick={() => setBudget(b)} style={{
                padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                background: budget === b ? 'var(--accent)' : 'var(--bg3)',
                color: budget === b ? '#000' : 'var(--text2)',
                border: `1px solid ${budget === b ? 'var(--accent)' : 'var(--border)'}`,
                fontFamily: 'JetBrains Mono', transition: 'all 0.2s',
              }}>₹{b}</button>
            ))}
          </div>
        </div>

        {/* Optional filters */}
        <div className="grid-2" style={{ gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Cuisine (optional)</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '10px 14px', fontSize: 13 }}>
              <option value="">Any cuisine</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Diet preference</label>
            <select value={isVeg} onChange={e => setIsVeg(e.target.value)} style={{ padding: '10px 14px', fontSize: 13 }}>
              <option value="">No preference</option>
              <option value="true">Veg only 🟢</option>
              <option value="false">Non-Veg 🔴</option>
            </select>
          </div>
        </div>

        <button onClick={optimize} disabled={loading} className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center', marginTop: 20, borderRadius: 14 }}>
          {loading ? '🔍 Scanning all platforms...' : '⚡ Find My Meal Combo'}
        </button>
      </div>

      {/* Loading progress */}
      {loading && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                borderRadius: 4, transition: 'width 0.5s ease',
                boxShadow: '0 0 10px rgba(0,255,136,0.5)',
              }} />
            </div>
          </div>
          <div style={{ color: 'var(--accent)', fontSize: 13, fontFamily: 'JetBrains Mono' }}>
            {STEPS[stepIdx]}
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div>
          {/* Summary banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,204,102,0.04))',
            border: '1.5px solid var(--accent)', borderRadius: 18, padding: 24,
            marginBottom: 20, boxShadow: 'var(--glow)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              {[
                { label: 'Total Bill', value: `₹${result.totalCost}`, accent: true },
                { label: 'You Save',   value: `₹${result.totalSaving}`, color: 'var(--accent2)' },
                { label: 'Remaining',  value: `₹${result.remaining}`,   color: 'var(--text2)' },
                { label: 'Items',      value: result.items.length,       color: 'var(--text)' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'JetBrains Mono', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 26, fontWeight: 800, color: s.accent ? 'var(--accent)' : s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Items list */}
          <h3 style={{ fontFamily: 'Clash Display', fontSize: 20, marginBottom: 14 }}>Your Optimal Meal Plan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {result.items.map((item, i) => (
              <div key={i} className="card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', flex: 1 }}>
                    <span style={{ fontSize: 32 }}>{item.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.foodName}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <PlatformBadge platform={item.platform} />
                        <span style={{ fontSize: 12, color: 'var(--text3)' }}>{item.restaurant}</span>
                        {item.coupon && <CouponTag coupon={item.coupon} discount={item.couponDiscount} />}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>⏱ {item.deliveryTime}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>₹{item.price}</div>
                    {item.saving > 0 && (
                      <>
                        <div style={{ fontSize: 11, color: 'var(--text3)', textDecoration: 'line-through' }}>₹{item.originalPrice}</div>
                        <div style={{ fontSize: 11, color: 'var(--accent2)' }}>Save ₹{item.saving}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={savePlan} disabled={saved} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {saved ? '✓ Plan Saved!' : '💾 Save This Plan'}
            </button>
            <button onClick={optimize} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              🔄 Optimize Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { PlatformBadge, CouponTag } from '../components/FoodCard';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const PLATFORM_COLORS = { Swiggy: '#FF5200', Zomato: '#E23744', Magicpin: '#6C3CE1', EatSure: '#00A651', Dunzo: '#00D290' };

export default function FoodDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [food, setFood]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/foods/${slug}`)
      .then(r => setFood(r.data.food))
      .catch(() => toast.error('Food not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleWishlist = async () => {
    if (!user) { toast.error('Login to save to wishlist'); return; }
    try {
      const res = await api.post(`/wishlist/${food._id}`);
      toast.success(res.data.message);
    } catch { toast.error('Failed'); }
  };

  if (loading) return (
    <div className="page-container">
      <div className="card skeleton" style={{ height: 200, marginBottom: 16 }} />
      <div className="grid-3">{Array(3).fill(0).map((_, i) => <div key={i} className="card skeleton" style={{ height: 180 }} />)}</div>
    </div>
  );

  if (!food) return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 48 }}>🍽</div>
      <h2>Food not found</h2>
      <Link to="/search" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Search</Link>
    </div>
  );

  const sorted  = [...(food.platforms || [])].sort((a, b) => a.price - b.price);
  const lowest  = sorted[0];
  const highest = sorted[sorted.length - 1];
  const maxSaving = highest ? highest.price - lowest.price : 0;

  return (
    <div className="page-container">
      <Link to="/search" style={{ color: 'var(--text2)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
        ← Back to Search
      </Link>

      {/* Header card */}
      <div className="card" style={{ marginBottom: 24, padding: 32 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{
            width: 100, height: 100, borderRadius: 20, flexShrink: 0,
            background: 'var(--bg3)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56,
          }}>{food.emoji}</div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              <h1 style={{ fontFamily: 'Clash Display', fontSize: 32, fontWeight: 700 }}>{food.name}</h1>
              <div style={{
                width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                border: `2px solid ${food.isVeg ? '#00cc66' : '#cc0000'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: food.isVeg ? '#00cc66' : '#cc0000' }} />
              </div>
              {food.isTrending && <span className="badge badge-orange">🔥 Trending</span>}
            </div>

            <div style={{ color: 'var(--text2)', marginBottom: 12, fontSize: 14 }}>{food.category} · ★ {food.avgRating}</div>
            {food.description && <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16 }}>{food.description}</p>}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {food.tags?.map(t => (
                <span key={t} style={{
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: 20, padding: '4px 12px', fontSize: 12, color: 'var(--text2)',
                }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>Best Price</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 40, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>₹{lowest?.price}</div>
            {maxSaving > 0 && <div style={{ fontSize: 13, color: 'var(--accent2)', marginTop: 4 }}>Save up to ₹{maxSaving} vs priciest</div>}
            <button onClick={handleWishlist} className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>♡ Wishlist</button>
          </div>
        </div>
      </div>

      {/* Savings banner */}
      {maxSaving > 0 && (
        <div style={{
          background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)',
          borderRadius: 14, padding: '16px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>💡</span>
          <span style={{ fontSize: 14, color: 'var(--text2)' }}>
            Ordering from <strong style={{ color: 'var(--accent)' }}>{lowest?.platform}</strong> saves you <strong style={{ color: 'var(--accent)' }}>₹{maxSaving}</strong> compared to {highest?.platform}.
            {lowest?.coupon && ` Apply coupon `}
            {lowest?.coupon && <strong style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono' }}>{lowest.coupon}</strong>}
            {lowest?.coupon && ` for extra savings.`}
          </span>
        </div>
      )}

      {/* Platform cards */}
      <h2 style={{ fontFamily: 'Clash Display', fontSize: 22, marginBottom: 16 }}>Price Comparison</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {sorted.map((p, i) => {
          const saving = p.originalPrice - p.price;
          const isLowest = i === 0;
          return (
            <div key={i} style={{
              background: isLowest ? 'linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,204,102,0.03))' : 'var(--bg2)',
              border: `1px solid ${isLowest ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 16, padding: '20px 24px',
              boxShadow: isLowest ? 'var(--glow)' : 'none',
              position: 'relative', overflow: 'hidden',
              animation: 'fadeUp 0.4s ease forwards',
              animationDelay: `${i * 0.07}s`, opacity: 0,
            }}>
              {isLowest && (
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  background: 'var(--accent)', color: '#000',
                  fontSize: 10, fontWeight: 900, padding: '4px 14px',
                  borderBottomLeftRadius: 12, fontFamily: 'JetBrains Mono', letterSpacing: 1,
                }}>BEST DEAL</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                    <PlatformBadge platform={p.platform} size="md" />
                    <span style={{ fontSize: 13, color: 'var(--text2)' }}>★ {p.rating}</span>
                    <span style={{ fontSize: 13, color: 'var(--text3)' }}>⏱ {p.deliveryTime}</span>
                    {p.deliveryFee > 0 && <span style={{ fontSize: 13, color: 'var(--text3)' }}>🛵 ₹{p.deliveryFee} delivery</span>}
                  </div>
                  <div style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 8 }}>{p.restaurant}</div>
                  {p.coupon ? (
                    <CouponTag coupon={p.coupon} discount={p.couponDiscount} />
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text3)' }}>No coupon available</span>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 32, fontWeight: 800, color: isLowest ? 'var(--accent)' : 'var(--text)', lineHeight: 1 }}>₹{p.price}</div>
                  {saving > 0 && (
                    <>
                      <div style={{ fontSize: 12, color: 'var(--text3)', textDecoration: 'line-through', marginTop: 4 }}>₹{p.originalPrice}</div>
                      <div style={{ fontSize: 12, color: 'var(--accent2)' }}>Save ₹{saving}</div>
                    </>
                  )}
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                    Total: ₹{p.price + (p.deliveryFee || 0)}
                  </div>
                </div>
              </div>

              {/* Price bar */}
              <div style={{ marginTop: 14 }}>
                <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${(p.price / (sorted[sorted.length - 1]?.price || p.price)) * 100}%`,
                    background: isLowest ? 'linear-gradient(90deg, var(--accent), var(--accent2))' : `${PLATFORM_COLORS[p.platform] || '#555'}66`,
                    transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PLATFORM_COLORS = {
  Swiggy: '#FF5200', Zomato: '#E23744', Magicpin: '#6C3CE1',
  EatSure: '#00A651', Dunzo: '#00D290',
};

export function PlatformBadge({ platform, size = 'sm' }) {
  const color = PLATFORM_COLORS[platform] || '#555';
  return (
    <span style={{
      background: color, color: '#fff',
      fontSize: size === 'sm' ? 10 : 12,
      fontWeight: 700, padding: size === 'sm' ? '2px 8px' : '4px 12px',
      borderRadius: 20, fontFamily: 'JetBrains Mono', letterSpacing: 0.5,
    }}>{platform}</span>
  );
}

export function CouponTag({ coupon, discount }) {
  if (!coupon) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'rgba(0,255,136,0.1)', border: '1px dashed var(--accent)',
      borderRadius: 6, padding: '2px 8px',
      fontSize: 10, color: 'var(--accent)', fontFamily: 'JetBrains Mono',
    }}>🏷 {coupon} {discount > 0 && `-₹${discount}`}</span>
  );
}

export function PriceTag({ price, originalPrice, isLowest }) {
  const saving = originalPrice - price;
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{
        fontSize: 22, fontWeight: 800,
        color: isLowest ? 'var(--accent)' : 'var(--text)',
        fontFamily: 'JetBrains Mono',
      }}>₹{price}</div>
      {saving > 0 && (
        <>
          <div style={{ fontSize: 11, color: 'var(--text3)', textDecoration: 'line-through' }}>₹{originalPrice}</div>
          <div style={{ fontSize: 11, color: 'var(--accent2)' }}>Save ₹{saving}</div>
        </>
      )}
    </div>
  );
}

export default function FoodCard({ food, onWishlistToggle }) {
  const { user } = useAuth();
  const cheapest = food.platforms?.reduce((min, p) => p.price < (min?.price ?? Infinity) ? p : min, null);
  const saving   = cheapest ? cheapest.originalPrice - cheapest.price : 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to save wishlist'); return; }
    try {
      const res = await api.post(`/wishlist/${food._id}`);
      toast.success(res.data.message);
      onWishlistToggle?.(food._id, res.data.action);
    } catch { toast.error('Failed to update wishlist'); }
  };

  return (
    <Link to={`/food/${food.slug}`} style={{ display: 'block' }}>
      <div className="card" style={{
        transition: 'all 0.25s', cursor: 'pointer', position: 'relative', overflow: 'hidden',
        borderColor: food.isTrending ? 'var(--border2)' : 'var(--border)',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--accent3)'; e.currentTarget.style.boxShadow = 'var(--glow)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = food.isTrending ? 'var(--border2)' : 'var(--border)'; e.currentTarget.style.boxShadow = ''; }}
      >
        {food.isTrending && (
          <div style={{
            position: 'absolute', top: 0, left: 0,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            color: '#000', fontSize: 9, fontWeight: 900,
            padding: '3px 10px', borderBottomRightRadius: 10, letterSpacing: 1,
            fontFamily: 'JetBrains Mono',
          }}>🔥 TRENDING</div>
        )}

        <button onClick={handleWishlist} style={{
          position: 'absolute', top: 12, right: 12,
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '4px 8px', fontSize: 16, zIndex: 1,
        }}>♡</button>

        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginTop: food.isTrending ? 20 : 0 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 14, flexShrink: 0,
            background: 'var(--bg3)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 32, border: '1px solid var(--border)',
          }}>{food.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{
                width: 10, height: 10, borderRadius: 2, flexShrink: 0,
                border: `2px solid ${food.isVeg ? '#00cc66' : '#cc0000'}`,
                display: 'inline-block',
              }}>
                <span style={{
                  display: 'block', width: 6, height: 6, borderRadius: '50%', margin: '0px 0 0 0',
                  background: food.isVeg ? '#00cc66' : '#cc0000', transform: 'translate(0px, -1px)',
                }} />
              </span>
              <span style={{ fontFamily: 'Clash Display', fontWeight: 600, fontSize: 15 }}>{food.name}</span>
            </div>
            <div style={{ color: 'var(--text3)', fontSize: 11, marginBottom: 8 }}>{food.category}</div>
            {cheapest && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <PlatformBadge platform={cheapest.platform} />
                    {cheapest.coupon && <CouponTag coupon={cheapest.coupon} discount={cheapest.couponDiscount} />}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                    ★ {food.avgRating} · {cheapest.deliveryTime}
                  </div>
                </div>
                <PriceTag price={cheapest.price} originalPrice={cheapest.originalPrice} isLowest />
              </div>
            )}
          </div>
        </div>

        {food.platforms?.length > 1 && (
          <div style={{
            marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)',
            display: 'flex', gap: 6, flexWrap: 'wrap',
          }}>
            {food.platforms.slice(1).map((p, i) => (
              <span key={i} style={{ fontSize: 11, color: 'var(--text3)' }}>
                {p.platform} <span style={{ color: 'var(--text2)', fontFamily: 'JetBrains Mono' }}>₹{p.price}</span>
                {i < food.platforms.length - 2 ? ' · ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

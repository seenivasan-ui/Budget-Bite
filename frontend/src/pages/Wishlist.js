import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import FoodCard from '../components/FoodCard';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    api.get('/wishlist')
      .then(r => setWishlist(r.data.wishlist))
      .catch(() => toast.error('Failed to load wishlist'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (foodId, action) => {
    if (action === 'removed') setWishlist(w => w.filter(f => f._id !== foodId));
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Clash Display', fontSize: 30, fontWeight: 700 }}>My Wishlist</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>{wishlist.length} saved dishes</p>
        </div>
        <Link to="/search" className="btn btn-secondary">+ Add More</Link>
      </div>

      {loading && (
        <div className="grid-3">{Array(3).fill(0).map((_, i) => <div key={i} className="card skeleton" style={{ height: 160 }} />)}</div>
      )}

      {!loading && wishlist.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❤️</div>
          <h3 style={{ fontFamily: 'Clash Display', marginBottom: 8 }}>No saved dishes yet</h3>
          <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Search for food and tap ♡ to save your favorites</p>
          <Link to="/search" className="btn btn-primary">Browse Dishes</Link>
        </div>
      )}

      {!loading && wishlist.length > 0 && (
        <div className="grid-3">
          {wishlist.map(f => <FoodCard key={f._id} food={f} onWishlistToggle={handleToggle} />)}
        </div>
      )}
    </div>
  );
}

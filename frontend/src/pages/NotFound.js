import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <div>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🍽</div>
        <h1 style={{ fontFamily: 'Clash Display', fontSize: 64, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontFamily: 'Clash Display', fontSize: 24, margin: '16px 0 12px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 28 }}>Looks like this dish isn't on the menu.</p>
        <Link to="/" className="btn btn-primary btn-lg">← Back to Home</Link>
      </div>
    </div>
  );
}

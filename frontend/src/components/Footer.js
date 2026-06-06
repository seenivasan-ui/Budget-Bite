import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg2)', borderTop: '1px solid var(--border)',
      padding: '48px 24px 24px',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #00ff88, #00cc55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>🍽</div>
              <span style={{ fontFamily: 'Clash Display', fontSize: 20, fontWeight: 700 }}>BudgetBite</span>
            </div>
            <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              Compare food prices across Swiggy, Zomato & more. Get the best deals with auto-applied coupons and smart budget planning.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text)', fontSize: 14 }}>Explore</div>
            {[['Search Food', '/search'], ['Budget Planner', '/budget'], ['Trending', '/search?trending=true']].map(([l, h]) => (
              <Link key={h} to={h} style={{ display: 'block', color: 'var(--text2)', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
              >{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text)', fontSize: 14 }}>Account</div>
            {[['Login', '/login'], ['Sign Up', '/register'], ['Profile', '/profile'], ['Wishlist', '/wishlist']].map(([l, h]) => (
              <Link key={h} to={h} style={{ display: 'block', color: 'var(--text2)', fontSize: 14, marginBottom: 10 }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
              >{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text)', fontSize: 14 }}>Platforms</div>
            {['Swiggy', 'Zomato', 'Magicpin', 'EatSure', 'Dunzo'].map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: `var(--${p.toLowerCase()})`,
                }} />
                <span style={{ color: 'var(--text2)', fontSize: 14 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ color: 'var(--text3)', fontSize: 13 }}>© 2024 BudgetBite. All rights reserved.</span>
          <span style={{ color: 'var(--text3)', fontSize: 13 }}>Built with MERN Stack 🚀</span>
        </div>
      </div>
      <style>{`@media(max-width:768px){footer .container > div:first-child{grid-template-columns:1fr 1fr!important;gap:24px!important}}`}</style>
    </footer>
  );
}

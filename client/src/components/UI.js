// Shared UI components

export function PlatformBadge({ platform }) {
  const colors = {
    Swiggy: '#FF5200', Zomato: '#E23744',
    Magicpin: '#6C3CE1', EatSure: '#00A651', Dunzo: '#00D290'
  };
  const bg = colors[platform] || '#555';
  return (
    <span style={{
      background: bg, color: '#fff', fontSize: 10, fontWeight: 700,
      padding: '2px 8px', borderRadius: 20, letterSpacing: 0.5,
      fontFamily: 'var(--mono)', whiteSpace: 'nowrap'
    }}>{platform}</span>
  );
}

export function StarRating({ rating }) {
  return <span style={{ color: '#f5a623', fontSize: 12, fontWeight: 700 }}>★ {rating}</span>;
}

export function VegBadge({ isVeg }) {
  return (
    <span style={{
      border: `1.5px solid ${isVeg ? '#00cc55' : '#e23744'}`,
      borderRadius: 3, padding: '1px 5px',
      fontSize: 10, color: isVeg ? '#00cc55' : '#e23744', fontWeight: 700
    }}>{isVeg ? 'VEG' : 'NON-VEG'}</span>
  );
}

export function Card({ children, style = {}, glow = false }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: `1px solid ${glow ? 'var(--green)' : 'var(--border)'}`,
      borderRadius: 16, padding: 20,
      boxShadow: glow ? '0 0 24px rgba(0,255,136,0.1)' : 'none',
      ...style
    }}>{children}</div>
  );
}

export function Button({ children, onClick, variant = 'primary', disabled, style = {}, type = 'button' }) {
  const variants = {
    primary: { background: 'linear-gradient(135deg, var(--green), var(--green2))', color: '#000', border: 'none' },
    outline: { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)' },
    danger: { background: 'transparent', color: '#ff4757', border: '1px solid #ff4757' },
    ghost: { background: 'rgba(0,255,136,0.08)', color: 'var(--green)', border: '1px solid rgba(0,255,136,0.2)' }
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...variants[variant],
      padding: '10px 20px', borderRadius: 12,
      fontWeight: 700, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, transition: 'all 0.2s',
      fontFamily: 'var(--font)',
      ...style
    }}>{children}</button>
  );
}

export function Input({ label, type = 'text', value, onChange, placeholder, style = {} }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>{label}</label>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '12px 16px', color: 'var(--text)',
          fontSize: 14, outline: 'none', transition: 'border 0.2s', ...style
        }}
        onFocus={e => e.target.style.borderColor = 'var(--green)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <div style={{
        width: 40, height: 40, border: '3px solid var(--border)',
        borderTop: '3px solid var(--green)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
    </div>
  );
}

export function Label({ children, style = {} }) {
  return (
    <div style={{
      fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)',
      letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase', ...style
    }}>{children}</div>
  );
}

export function StatCard({ label, value, icon, color = 'var(--green)' }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: `${color}18`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 22
        }}>{icon}</div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'var(--mono)', color }}>{value}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</div>
        </div>
      </div>
    </Card>
  );
}

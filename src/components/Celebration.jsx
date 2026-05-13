export default function Celebration({ open, emoji, title, desc, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex items-center justify-center p-5" style={{ animation: 'fadeIn 0.4s' }}>
      <div
        className="max-w-[360px] w-full rounded-3xl text-center relative border"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--accent)',
          animation: 'scaleIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
          padding: '36px 24px',
        }}
      >
        <span className="text-[70px] mb-3 inline-block" style={{ animation: 'spin 1s ease' }}>{emoji}</span>
        <h3 className="font-display font-black text-[26px] mb-3 leading-tight" style={{ color: 'var(--accent)', letterSpacing: '-1px' }}>{title}</h3>
        <p className="mb-5 leading-relaxed text-[14px] font-light" style={{ color: 'var(--text-dim)' }}>{desc}</p>
        <button
          className="w-full py-3.5 rounded-xl font-black cursor-pointer text-[13px] tracking-[1.5px] uppercase font-mono active:scale-[0.97]"
          style={{ background: 'var(--accent)', color: '#000', border: 'none' }}
          onClick={onClose}
        >
          המשך מצוד
        </button>
      </div>
    </div>
  );
}

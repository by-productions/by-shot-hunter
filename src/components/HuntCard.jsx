import { useState } from 'react';

export default function HuntCard({ hunt, index, isFound, onToggle }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden relative transition-all duration-300 border"
      style={{
        background: isFound ? 'linear-gradient(135deg, rgba(255, 61, 122, 0.12), var(--bg-card))' : 'var(--bg-card)',
        borderColor: isFound ? 'var(--accent)' : 'var(--border)',
      }}
    >
      <div className="p-[18px] flex gap-3.5 items-start cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-display font-black text-[19px] transition-all duration-300"
          style={{
            background: isFound ? 'var(--accent)' : 'var(--bg-elevated)',
            color: isFound ? '#000' : 'var(--text-dim)',
            letterSpacing: '-0.5px',
          }}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <div className="font-display font-black text-[17px] leading-tight flex-1" style={{ letterSpacing: '-0.5px' }}>{hunt.title}</div>
            <div
              className="flex-shrink-0 px-2 py-[3px] rounded-full text-[10px] font-bold font-mono tracking-wide"
              style={{
                background: isFound ? 'var(--accent)' : 'rgba(214, 255, 58, 0.15)',
                color: isFound ? '#000' : 'var(--xp)',
              }}
            >
              +{hunt.xp}
            </div>
          </div>
          <div className="text-[13px] leading-snug font-light" style={{ color: 'var(--text-dim)' }}>{hunt.hint}</div>
        </div>
      </div>

      <div
        className="flex items-center justify-between py-2.5 px-[18px] border-t text-[11px] tracking-[1.5px] uppercase font-mono font-bold cursor-pointer"
        style={{ borderTopColor: isFound ? 'rgba(255, 61, 122, 0.15)' : 'var(--border)', color: 'var(--text-faint)' }}
        onClick={() => setExpanded(!expanded)}
      >
        <span>איך אנחנו אוהבים את זה</span>
        <span className="text-[14px] transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
      </div>

      <div className="overflow-hidden transition-all duration-400" style={{ maxHeight: expanded ? '400px' : '0' }}>
        <div className="px-[18px] pt-3.5">
          <ul className="mb-4 list-none">
            {hunt.details.map((d, i) => (
              <li key={i} className="text-[13px] py-1 pr-4 relative font-light leading-snug" style={{ color: 'var(--text-dim)' }}>
                <span className="absolute right-0 top-1 text-[9px]" style={{ color: 'var(--accent)' }}>◆</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        className="mx-[18px] mb-[18px] py-3.5 rounded-xl font-black text-[14px] tracking-[1px] uppercase cursor-pointer font-mono transition-all active:scale-[0.97] border block"
        style={{
          background: isFound ? 'transparent' : 'var(--accent)',
          color: isFound ? 'var(--accent)' : '#000',
          borderColor: 'var(--accent)',
          width: 'calc(100% - 36px)',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {isFound ? '✓ נתפס · לחץ לביטול' : 'סמן כתפוס'}
      </button>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';

export default function HUD({ rank, xp, totalXP, foundCount, totalCount, nextRank }) {
  const [pulseXP, setPulseXP] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const xpRef = useRef(xp);
  const rankIdxRef = useRef(rank.index);

  useEffect(() => {
    if (xp !== xpRef.current) {
      setPulseXP(false);
      requestAnimationFrame(() => setPulseXP(true));
      xpRef.current = xp;
    }
  }, [xp]);

  useEffect(() => {
    if (rank.index > rankIdxRef.current) {
      setLevelUp(true);
      setTimeout(() => setLevelUp(false), 800);
    }
    rankIdxRef.current = rank.index;
  }, [rank.index]);

  const progressPct = totalXP > 0 ? (xp / totalXP) * 100 : 0;

  return (
    <div
      className="fixed top-0 right-0 left-0 z-[100] backdrop-blur-xl bg-black/80 border-b border-white/[0.08]"
      style={{ padding: 'calc(10px + var(--safe-top)) 16px 10px' }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="text-[11px] font-black tracking-[2px] text-[#b0b0b0]">
            B<span className="text-brand-pink">.</span>Y
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated rounded-full transition-all duration-300 border"
            style={{
              borderColor: levelUp ? 'var(--accent)' : 'var(--border-strong)',
              boxShadow: levelUp ? '0 0 24px var(--accent-glow)' : 'none',
              animation: levelUp ? 'bounce 0.6s' : 'none',
            }}
          >
            <div className="w-[18px] h-[18px] rounded-full bg-brand-pink text-black flex items-center justify-center text-[11px] font-black font-display">
              {rank.letter}
            </div>
            <div className="text-[10px] font-black tracking-[1.5px] uppercase font-mono">
              {rank.name}
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-[5px] bg-bg-elevated rounded-full font-mono text-[11px] font-bold border"
          style={{ borderColor: 'var(--border-strong)' }}
        >
          <span
            className="transition-all"
            style={{
              color: 'var(--xp)',
              animation: pulseXP ? 'xpPulse 0.6s' : 'none',
            }}
          >
            {xp}
          </span>
          <span className="text-[#6a6a6a] text-[9px] tracking-[1px]">XP</span>
        </div>
      </div>
      <div className="h-1 bg-white/[0.08] rounded-sm overflow-hidden relative">
        <div
          className="h-full shimmer-bar"
          style={{
            background: 'linear-gradient(90deg, #ff3d7a, #d6ff3a)',
            width: `${progressPct}%`,
            transition: 'width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        />
      </div>
      <div className="flex justify-between font-mono text-[9px] tracking-[1px] text-[#6a6a6a] mt-1">
        <span>
          <b className="text-brand-pink font-bold">{foundCount}</b>/{totalCount} שוטים
        </span>
        <span>
          {nextRank
            ? `${nextRank.xpMin - xp} XP ל-${nextRank.name}`
            : 'דרגה מקסימלית הושגה'}
        </span>
      </div>
    </div>
  );
}

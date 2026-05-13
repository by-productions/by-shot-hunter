import { RANKS } from '../data/defaults.js';

export default function RanksStrip({ currentRankIdx, xp }) {
  return (
    <div className="-mx-4 px-4 overflow-x-auto no-scrollbar mt-6">
      <div className="flex gap-2 min-w-max pb-1">
        {RANKS.map((rank, i) => {
          const unlocked = xp >= rank.xpMin;
          const current = i === currentRankIdx;
          return (
            <div
              key={rank.name}
              className="py-3 px-4 rounded-xl text-center transition-all duration-400 min-w-[100px] border"
              style={{
                background: current ? 'var(--accent)' : unlocked ? 'var(--accent-soft)' : 'var(--bg-card)',
                borderColor: current ? 'var(--accent)' : unlocked ? 'rgba(255, 61, 122, 0.3)' : 'var(--border)',
                color: current ? '#000' : 'inherit',
                transform: current ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              <div className="text-[10px] font-black tracking-[1.5px] uppercase mb-1 font-mono">{rank.name}</div>
              <div className="text-[9px] tracking-[1px] font-mono" style={{ color: current ? 'rgba(0,0,0,0.6)' : 'var(--text-faint)' }}>
                {rank.xpMin}+ XP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
